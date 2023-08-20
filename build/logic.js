"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logic = void 0;
const stripe_1 = require("./stripe");
const node_fetch_1 = __importDefault(require("node-fetch"));
class Logic {
    constructor(paymentRecords) {
        this.paymentRecords = paymentRecords;
        this.stripeCient = stripe_1.AppStripeClient.getStripeClient();
    }
    //iahv
    //ashram
    //cfc
    //creates both our app user and stripe user
    //returns the stripe customer id
    async createOrUpdateUserAndGetStripeCustomerID(SiteType, Record) {
        let userCreated = false;
        const stripe = this.stripeCient.get(SiteType);
        let stripeCustomerID;
        try {
            //get stripe customer id
            const customers = await stripe.customers.list({
                email: Record.email
            });
            if (customers.data.length == 0) {
                //create it
                let address = {
                    city: Record.locCity,
                    postal_code: Record.locPostalCode,
                    state: Record.locProvince,
                    line1: Record.locStreet
                };
                const createdCustomer = await stripe.customers.create({
                    email: Record.email,
                    phone: Record.phoneNumber,
                    name: Record.firstName + Record.lastName,
                    address: address
                });
                stripeCustomerID = createdCustomer.id;
            }
            else {
                stripeCustomerID = customers.data[0].id;
            }
        }
        catch (err) {
            console.log("error retreiving/creating stripe user for " + Record.email + " error is " + err);
            throw err;
        }
        try {
            //check if user exists
            //get user email and stripecustomerid
            const userExistObj = await this.paymentRecords.getUserStripeCustomerID(Record.email, SiteType.toString());
            if (!userExistObj.userExists) {
                //create user with the stripe customer id
                //create user if does not exist
                await this.paymentRecords.addUserIfDoesNotExist({
                    email: Record.email,
                    firstName: Record.firstName,
                    lastName: Record.lastName,
                    phoneNumber: Record.phoneNumber,
                    locCity: Record.locCity,
                    locPostalCode: Record.locPostalCode,
                    locProvince: Record.locProvince,
                    locStreet: Record.locStreet,
                    stripeCustomerID: stripeCustomerID
                });
                userCreated = true;
            }
            else if (userExistObj.stripeCustomerID == null) {
                //update user with stripe customer id
                await this.paymentRecords.insertUserStripeCustomerID(Record.email, stripeCustomerID, SiteType.toString());
            }
            else {
                stripeCustomerID = userExistObj.stripeCustomerID;
            }
        }
        catch (err) {
            console.log("error createUserIfDoesNotExist for user " + Record.email + " is " + err);
            console.trace();
            throw err;
        }
        //always update the users location
        //so that the updated location is saved and used when we generate tax receipts
        try {
            if (!userCreated) {
                this.paymentRecords.updateUserLocation(Record);
            }
        }
        catch (err) {
            console.log("error createOrUpdateUserAndGetStripeCustomerID " + err);
            console.trace();
        }
        return stripeCustomerID;
    }
    async isUserSafeGoogleRecaptcha(GoogleCaptchaToken, UserIP) {
        const body = JSON.stringify({
            secret: process.env.GOOGLE_CAPTCHA_SECRET_KEY,
            response: GoogleCaptchaToken
        });
        const response = await node_fetch_1.default('https://www.google.com/recaptcha/api/siteverify', {
            method: 'post',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${"6LdUYHEkAAAAAP_fY5cAnEUo0SpQaGY_XGFXrXHI"}&response=${GoogleCaptchaToken}&remoteip=${UserIP}`,
        });
        const data = await response.json();
        console.log("google recaptcha response: " + JSON.stringify(data));
        if (data.success) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.Logic = Logic;
