/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/camelcase */
/**
 * payments.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet)
 * and Thorsten Schaeff (@thorwebdev).
 *
 * This modern JavaScript file handles the checkout process using Stripe.
 *
 * 1. It shows how to avv bvb ept card payments with the `card` Element, and
 * the `paymentRequestButton` Element for Payment Request and Apple Pay.
 * 2. It shows how to use the Stripe Sources API to accept non-card payments,
 * such as iDEAL, SOFORT, SEPA Direct Debit, and more.
 */

(async () => {
  'use strict';

  // Retrieve the configuration for the store.
  const config = await store.getConfig();

  // Create references to the main form and its submit button.
  const form = document.getElementById('payment-form');
  const submitButton = form.querySelector('button[type=submit]');

  //document.querySelector('#amount').disabled = true;

  const amount = document.querySelector('#amount');
  amount.value = 0;
  const amount_lbl = document.querySelector('#amount_label');

  amount.addEventListener('change', function (e) {
    amount_lbl.innerText = 'Amount : $ ' + amount.value;
  });


  const urlLink = new URL(window.location.href);
  amount.value = urlLink.searchParams.get('amount');

  amount_lbl.innerText = 'Amount : $ ' + amount.value;

  // Global variable to store the PaymentIntent object.
  let paymentIntent;

  /**
   * Setup Stripe Elements.
   */

  // Create a Stripe client.
  const stripe = Stripe(config.stripePublishableKey);

  // Create an instance of Elements.
  const elements = stripe.elements();

  // Prepare the styles for Elements.
  const style = {
    base: {
      iconColor: '#666ee8',
      color: '#319325f',
      fontWeight: 400,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': {
        color: '#aab7c4',
      },
      ':-webkit-autofill': {
        color: '#666ee8',
      },
    },
  };

  /**
   * Implement a Stripe Card Element that matches the look-and-feel of the app.
   *
   * This makes it easy to collect debit and credit card payments information.
   */

  // Create a Card Element and pass some custom styles to it.
  const card = elements.create('card', { style });

  // Mount the Card Element on the page.
  card.mount('#card-element');

  // Monitor change events on the Card Element to display any errors.
  card.on('change', ({ error }) => {
    const cardErrors = document.getElementById('card-errors');
    if (error) {
      cardErrors.textContent = error.message;
      cardErrors.classList.add('visible');
    } else {
      cardErrors.classList.remove('visible');
    }
    // Re-enable the Pay button.
    submitButton.disabled = false;
  });

  /**
   * Implement a Stripe IBAN Element that matches the look-and-feel of the app.
   *
   * This makes it easy to collect bank account information.
   */

  // Create a IBAN Element and pass the right options for styles and supported countries.
  const ibanOptions = {
    style,
    supportedCountries: ['SEPA'],
  };
  const iban = elements.create('iban', ibanOptions);

  // Mount the IBAN Element on the page.
  iban.mount('#iban-element');

  // Monitor change events on the IBAN Element to display any errors.
  iban.on('change', ({ error, bankName }) => {
    const ibanErrors = document.getElementById('iban-errors');
    if (error) {
      ibanErrors.textContent = error.message;
      ibanErrors.classList.add('visible');
    } else {
      ibanErrors.classList.remove('visible');
      if (bankName) {
        updateButtonLabel('sepa_debit', bankName);
      }
    }
    // Re-enable the Pay button.
    submitButton.disabled = false;
  });

  /**
   * Add an iDEAL Bank selection Element that matches the look-and-feel of the app.
   *
   * This allows you to send the customer directly to their iDEAL enabled bank.
   */

  // Create a iDEAL Bank Element and pass the style options, along with an extra `padding` property.
  const idealBank = elements.create('idealBank', {
    style: { base: Object.assign({ padding: '10px 15px' }, style.base) },
  });

  // Mount the iDEAL Bank Element on the page.
  idealBank.mount('#ideal-bank-element');

  /**
   * Implement a Stripe Payment Request Button Element.
   *
   * This automatically supports the Payment Request API (already live on Chrome),
   * as well as Apple Pay on the Web on Safari, Google Pay, and Microsoft Pay.
   * When of these two options is available, this element adds a “Pay” button on top
   * of the page to let users pay in just a click (or a tap on mobile).
   */

  // Create the payment request.

  /**
   * Handle the form submission.
   *
   * This uses Stripe.js to confirm the PaymentIntent using payment details collected
   * with Elements.
   *
   * Please note this form is not submitted when the user chooses the "Pay" button
   * or Apple Pay, Google Pay, and Microsoft Pay since they provide name and
   * shipping information directly.
   */

  // Listen to changes to the user-selected country.

  // Submit handler for our payment form.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    //google captcha
    grecaptcha.ready(async function () {
      grecaptcha.execute('6LdUYHEkAAAAAEQA412KsgoNtjJhLiYCjFZiNaSG', { action: 'submit' }).then(async function (token) {
        // Add your logic to submit to your backend server here.


        //check if this is a donation or a course registration
        const paymentType = document.querySelector('#payment_type').value;

        // Retrieve the user information from the form.
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const phoneNumber = document.querySelector('#phone').value;

        // Create the PaymentIntent with the cart details.
        //document.getElementById('card-errors').textContent

        // Disable the Pay button to prevent multiple click events.
        submitButton.disabled = true;

        let response = null;


        const amount = document.querySelector('#amount').value;
        const locStreet = document.querySelector("#loc_street").value;
        const locCity = document.querySelector("#loc_city").value;
        const locProvince = document.querySelector("#loc_province").value;
        const locPostalCode = document.querySelector("#loc_postalcode").value;

        response = await store.createDonationPaymentIntent(
          config.currency,
          amount,
          name,
          email,
          phoneNumber,
          locStreet,
          locCity,
          locProvince,
          locPostalCode,
          "",
          "aarya",
          token,
          "aarya"
        );

        paymentIntent = response;

        //console.log(document.getElementById('card-errors').textContent);
        if (!document.getElementById('card-errors').classList.contains('visible')) {
          console.log('sending payment');
          document.getElementById('card-errors').textContent = '';
          submitButton.textContent = 'Processing…';
          const confirm_card_response = await stripe.confirmCardPayment(
            paymentIntent.client_secret,
            {
              payment_method: {
                card,
                billing_details: {
                  name: name,
                  email: email
                },
              },
            }
          );

          // we need to pass handlePayment the fields for name, email, friend_name, friend_email,
          // so we can send it to the backend on success.
          handlePayment(confirm_card_response, paymentType);
        }
        submitButton.disabled = false;



      });
    });

  });

  // Handle new PaymentIntent result
  const handlePayment = async (paymentResponse, paymentType) => {
    const { paymentIntent, error } = paymentResponse;

    const mainElement = document.getElementById('main');
    const confirmationElement = document.getElementById('confirmation');

    if (error) {
      confirmationElement.querySelector('.error-message').innerText =
        error.message;
      submitButton.innerText = 'Pay';
      const cardErrors = document.getElementById('card-errors');
      cardErrors.textContent = error.message;
      cardErrors.classList.add('visible');
    } else if (paymentIntent.status === 'succeeded') {
      // Success! Payment is confirmed. Update the interface to display the confirmation screen.
      mainElement.classList.remove('processing');
      mainElement.classList.remove('receiver');
      // Update the note about receipt and shipping (the payment has been fully confirmed by the bank).
      confirmationElement.querySelector('.note').innerText =
        'We just sent your receipt to your email address, and your items will be on their way shortly.';
      // send request to the backend to infrom of payment success
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const amount = document.querySelector('#amount').value;
      let comment = "";

      const commentObj = document.querySelector("#comment");

      if (commentObj != null) {
        comment = commentObj.value;
      }


      try {
        await store.sendSuccessToServer(
          email,
          name,
          amount,
          comment,
          paymentIntent.id,
          paymentType
        );
        document.querySelector('#payment-form').style.display = 'none';
        $(".success-message").show();
      }
      catch (err) {
        //nothing to do
      }

    } else if (paymentIntent.status === 'processing') {
      mainElement.classList.add('success');
    } else {
      // Payment has failed.
      mainElement.classList.remove('success');
      mainElement.classList.remove('processing');
      mainElement.classList.remove('receiver');
      mainElement.classList.add('error');
    }
  };

  /**
   * Monitor the status of a source after a redirect flow.
   *
   * This means there is a `source` parameter in the URL, and an active PaymentIntent.
   * When this happens, we'll monitor the status of the PaymentIntent and present real-time
   * information to the user.
   */

  const pollPaymentIntentStatus = async (
    paymentIntent,
    timeout = 30000,
    interval = 500,
    start = null
  ) => {
    start = start ? start : Date.now();
    const endStates = ['succeeded', 'processing', 'canceled'];
    // Retrieve the PaymentIntent status from our server.
    const rawResponse = await fetch(`payment_intents/${paymentIntent}/status`);
    const response = await rawResponse.json();
    if (
      !endStates.includes(response.paymentIntent.status) &&
      Date.now() < start + timeout
    ) {
      // Not done yet. Let's wait and check again.
      setTimeout(
        pollPaymentIntentStatus,
        interval,
        paymentIntent,
        timeout,
        interval,
        start
      );
    } else {
      handlePayment(response);
      if (!endStates.includes(response.paymentIntent.status)) {
        // Status has not changed yet. Let's time out.
        console.warn(new Error('Polling timed out.'));
      }
    }
  };

  const url = new URL(window.location.href);
  const mainElement = document.getElementById('main');
  if (url.searchParams.get('source') && url.searchParams.get('client_secret')) {
    // Update the interface to display the processing screen.
    mainElement.classList.add('checkout', 'success', 'processing');

    const { source } = await stripe.retrieveSource({
      id: url.searchParams.get('source'),
      client_secret: url.searchParams.get('client_secret'),
    });

    // Poll the PaymentIntent status.
    pollPaymentIntentStatus(source.metadata.paymentIntent);
  } else if (url.searchParams.get('payment_intent')) {
    // Poll the PaymentIntent status.
    pollPaymentIntentStatus(url.searchParams.get('payment_intent'));
  } else {
    // Update the interface to display the checkout form.
    mainElement.classList.add('checkout');
  }
  document.getElementById('main').classList.remove('loading');

  /**
   * Display the relevant payment methods for a selected country.
   */

  // List of relevant countries for the payment methods supported in this demo.
  // Read the Stripe guide: https://stripe.com/payments/payment-methods-guide
  const paymentMethods = {
    ach_credit_transfer: {
      name: 'Bank Transfer',
      flow: 'receiver',
      countries: ['US'],
      currencies: ['usd'],
    },
    alipay: {
      name: 'Alipay',
      flow: 'redirect',
      countries: ['CN', 'HK', 'SG', 'JP'],
      currencies: [
        'aud',
        'cad',
        'eur',
        'gbp',
        'hkd',
        'jpy',
        'nzd',
        'sgd',
        'usd',
      ],
    },
    bancontact: {
      name: 'Bancontact',
      flow: 'redirect',
      countries: ['BE'],
      currencies: ['eur'],
    },
    card: {
      name: 'Card',
      flow: 'none',
    },
    eps: {
      name: 'EPS',
      flow: 'redirect',
      countries: ['AT'],
      currencies: ['eur'],
    },
    ideal: {
      name: 'iDEAL',
      flow: 'redirect',
      countries: ['NL'],
      currencies: ['eur'],
    },
    giropay: {
      name: 'Giropay',
      flow: 'redirect',
      countries: ['DE'],
      currencies: ['eur'],
    },
    multibanco: {
      name: 'Multibanco',
      flow: 'receiver',
      countries: ['PT'],
      currencies: ['eur'],
    },
    sepa_debit: {
      name: 'SEPA Direct Debit',
      flow: 'none',
      countries: [
        'FR',
        'DE',
        'ES',
        'BE',
        'NL',
        'LU',
        'IT',
        'PT',
        'AT',
        'IE',
        'FI',
      ],
      currencies: ['eur'],
    },
    sofort: {
      name: 'SOFORT',
      flow: 'redirect',
      countries: ['DE', 'AT'],
      currencies: ['eur'],
    },
    wechat: {
      name: 'WeChat',
      flow: 'none',
      countries: ['CN', 'HK', 'SG', 'JP'],
      currencies: [
        'aud',
        'cad',
        'eur',
        'gbp',
        'hkd',
        'jpy',
        'nzd',
        'sgd',
        'usd',
      ],
    },
  };

  // Update the main button to reflect the payment method being selected.
  const updateButtonLabel = (paymentMethod, bankName) => {
    const amount = store.formatPrice(store.getPaymentTotal(), config.currency);
    const name = paymentMethods[paymentMethod].name;
    let label = `Pay ${amount}`;
    if (paymentMethod !== 'card') {
      label = `Pay ${amount} with ${name}`;
    }
    if (paymentMethod === 'wechat') {
      label = `Generate QR code to pay ${amount} with ${name}`;
    }
    if (paymentMethod === 'sepa_debit' && bankName) {
      label = `Debit ${amount} from ${bankName}`;
    }
    submitButton.innerText = label;
  };

  // Listen to changes to the payment method selector.
  for (const input of document.querySelectorAll('input[name=payment]')) {
    input.addEventListener('change', (event) => {
      event.preventDefault();
      const payment = form.querySelector('input[name=payment]:checked').value;
      const flow = paymentMethods[payment].flow;

      // Update button label.
      updateButtonLabel(event.target.value);

      // Show the relevant details, whether it's an extra element or extra information for the user.
      form
        .querySelector('.payment-info.card')
        .classList.toggle('visible', payment === 'card');
      form
        .querySelector('.payment-info.ideal')
        .classList.toggle('visible', payment === 'ideal');
      form
        .querySelector('.payment-info.sepa_debit')
        .classList.toggle('visible', payment === 'sepa_debit');
      form
        .querySelector('.payment-info.wechat')
        .classList.toggle('visible', payment === 'wechat');
      form
        .querySelector('.payment-info.redirect')
        .classList.toggle('visible', flow === 'redirect');
      form
        .querySelector('.payment-info.receiver')
        .classList.toggle('visible', flow === 'receiver');
      document
        .getElementById('card-errors')
        .classList.remove('visible', payment !== 'card');
    });
  }

  // Select the default country from the config on page load.
  let country = config.country;
  // Override it if a valid country is passed as a URL parameter.
  const urlParams = new URLSearchParams(window.location.search);
  const countryParam = urlParams.get('country')
    ? urlParams.get('country').toUpperCase()
    : config.country;
  if (form.querySelector(`option[value="${countryParam}"]`)) {
    country = countryParam;
    console.log(country);
  }
})();
