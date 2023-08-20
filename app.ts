/* eslint-disable @typescript-eslint/camelcase */
import Stripe from 'stripe';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import winston from 'winston';
import nodemailer from 'nodemailer';
import EmailGenerater from './emails/emailGenerator';
import { PaymentRecords } from './sql_db/sql_db';
import fetch from "node-fetch";
import { AppStripeClient } from './stripe';
import { Logic } from './logic';
import { SiteType } from './objects';


require('dotenv').config({ path: "./.env" });

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// initialize db
const paymentRecords: PaymentRecords = new PaymentRecords();

const stripeClient = AppStripeClient.getStripeClient();
const logicHelper = new Logic(paymentRecords);


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

const cors = require('cors');
app.use(cors());
app.set('trust proxy', true);

//this is hardcoded
const siteType = SiteType.AARYA;

/////////////////////////////////////////////////////////////////////////////////////////

// initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'credit-gifting-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// initialize node mailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});




/**
 * Creates the payment intent and returns the client_secret back to the client.
 */
app.post('/donationPaymentIntent', async (req, res) => {

  const paymentType = 'donation';
  const site: string = req.body.site;

  if (site == null || !((Object.values(SiteType) as string[]).includes(site)) ) {
    res.status(500).json({
      errorMessage: 'Site not provided or invalid.',
    });
    return;
  } 
  
  const amount: number = parseInt(req.body.amount);
  const email: string = req.body.email;
  const firstName: string = req.body.name;
  const lastName: string = req.body.lastName;
  const phoneNumber: string = req.body.phoneNumber;
  const locStreet: string = req.body.locStreet;
  const locPostalCode: string = req.body.locPostalCode;
  const locCity: string = req.body.locCity;
  const locProvince: string = req.body.locProvince;
  const donationCategory: string = req.body.cause;
  const otherInfo: string = "";
  const comment: string = req.body.comment;
  const googleCaptchaToken: string = req.body.googleCaptchaToken;

  if (email === "yamanemrah06@gmail.com"){
    res.status(500);
    console.log("blocked");
    return;
  }

  console.log("req ip is " + req.ip);

  //google recatpcha check
  try {
    let isUserSafe = logicHelper.isUserSafeGoogleRecaptcha(googleCaptchaToken, req.ip);
    if (!isUserSafe){
      res.status(500).json({
        errorMessage: 'Error',
      });
      return;
    }
  }
  catch (err) {
    console.log("error matching request to google recaptcha " + err);
    res.status(500).json({
      errorMessage: 'Error',
    });
    return;
  }

  if (!isValidAmount(amount)) {
    res.status(400).send({
      error: `${amount} is an invalid amount.`,
    });
    return;
  }

  let customerStripeID = "";

  //create user if does not exist
  //this includes both the stripe customer and our db user
  try {
    customerStripeID = await logicHelper.createOrUpdateUserAndGetStripeCustomerID(siteType, {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      locCity: locCity,
      locPostalCode: locPostalCode,
      locProvince: locProvince,
      locStreet: locStreet
    });
  }
  catch (err) {
    console.log('Error creating user ' + email + ' or getting stripe customer id is ' + err);
    res.status(500).json({
      errorMessage: 'Error creating user or getting stripe customer id'
    });
    return;
  }


  try {
    const paymentIntent = await stripeClient.get(siteType).paymentIntents.create({
      amount: amount * 100,
      currency: 'cad',
      payment_method_types: ['card'],
      customer: customerStripeID,
      metadata: {
        email,
        firstName,
        lastName,
        phoneNumber,
        locStreet,
        locPostalCode,
        locCity,
        locProvince,
        comment,
        donationCategory,
        isDonation: 'true',
        site: siteType,
        paymentType
      },
    });

    //save payment intent
    await paymentRecords.addPaymentIntent({
      paymentIntentID: paymentIntent.id,
      userEmail: email,
      amount: amount,
      paymentType: paymentType,
      donationCategory: donationCategory,
      otherInfo: otherInfo,
    },
      site
    );

    res.json({ client_secret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500);
    return;
  }
});



app.post('/donationSuccessPayment', async (req, res) => {

  try {

    const paymentIntentID: string = req.body.id;
    const name: string = req.body.name;
    const email: string = req.body.email;
    const amount: string = req.body.amount;
    const comment: string = req.body.comment;

    logger.info('donation. sending success payment ' + paymentIntentID);


    if (!paymentIntentID) {
      res.status(400).send({ error: 'bad request' });
      return;
    }

    await paymentRecords.addPaymentSuccess(paymentIntentID);

    //send email
    // const recipientMailOptions = {
    //   from: process.env.ADMIN_EMAIL,
    //   to: email,
    //   subject: 'IAHV Canada Donation',
    //   html: EmailGenerater.generateDonationSuccessEmail(name, amount, comment, new Date().toDateString())
    // };

    // await transporter.sendMail(recipientMailOptions, function (err, info) {
    //   if (err) {
    //     logger.error(`donation. Failed to notify = ${name}, email = ${email}, paymentID = ${paymentIntentID}`);
    //   }
    // });

  }
  catch (err) {
    console.log("donation. error in sending success " + err);
    logger.error(`donation. error in sending success email ${err}`);
    res.sendStatus(500);
    return;
  }


  res.status(200).json(
    {
      status: 'success'
    }
  );
  return;
});

/**
 * Returns the stripe publishable key to the client.
 */
app.get('/config', (req, res) => {

  res.status(200).send({
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeCountry: 'CA',
    country: 'CA',
    currency: 'cad',
    paymentMethods: ['card'],
  });      
  return;


});

app.get('/success', async (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/index.html'));
});

app.get('/', async (req, res) => {

  res.sendFile(path.join(__dirname + '/../public/aarya/index.html'));
  return;

});

app.get('/checkout', async (req, res) => {

  const amount = parseInt(req.query.amount);
  if (!isValidAmount(amount)) {
    if (!isValidAmount(amount)) {
      res.status(400).send({
        error: `${amount} is an invalid amount.`,
      });
      return;
    }
  }

  res.sendFile(path.join(__dirname + '/../public/aarya/checkout.html'));
  return;

});

app.get('/termsofuse', async (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/aarya/terms_of_use.html'));
  return;
});

app.get('/refund', async (req, res) => {
  res.sendFile(path.join(__dirname + '/../public/aarya/refund.html'));
  return;
});

app.listen(3010, (): void => {
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }
  try {
    paymentRecords.initializeDB();
  } catch (err) {
    logger.error('Could not connect to giftingRecords DB');
    return;
  }
  console.log('Gifting stripe server is listening on port 3010');
});

/**
 * Returns if amount entered is a valid option.
 * @param Amount amount
 * @returns
 */
function isValidAmount(Amount: number): boolean {
  if (Amount > 1) {
    return true;
  }
  return false;
}


