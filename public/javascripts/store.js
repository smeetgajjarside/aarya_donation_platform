/**
 * store.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet)
 * and Thorsten Schaeff (@thorwebdev).
 *
 * Representation of products, and line items stored in Stripe.
 * Please note this is overly simplified class for demo purposes (all products
 * are loaded for convenience, there is no cart management functionality, etc.).
 * A production app would need to handle this very differently.
 */


class Store {
  constructor() {
    //fill in amount value from url
  }

  // Retrieve the configuration from the API.
  async getConfig() {
    try {

      const params = Object.fromEntries(new URLSearchParams(location.search));

      //get site id from url 
      const response = await fetch('/config');
      const config = await response.json();
      if (config.stripePublishableKey.includes('live')) {
        // Hide the demo notice if the publishable key is in live mode.
      }
      return config;
    } catch (err) {
      return { error: err.message };
    }
  }

  // Create the PaymentIntent with the cart details.
  async createDonationPaymentIntent(
    currency,
    amount,
    name,
    email,
    phoneNumber,
    locStreet,
    locCity,
    locProvince,
    locPostalCode,
    comment,
    cause,
    googleCaptchaToken,
    siteType
  ) {
    try {
      const response = await fetch('/donationPaymentIntent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency,
          amount: amount,
          email: email,
          name: name,
          phoneNumber,
          locStreet,
          locCity,
          locProvince,
          locPostalCode,
          comment,
          cause,
          googleCaptchaToken: googleCaptchaToken,
          site: siteType
        }),
      });
      const data = await response.json();
      if (data.error) {
        return { error: data.error };
      } else {
        return data;
      }
    } catch (err) {
      return { error: err.message };
    }
  }

  async sendSuccessToServer(
    email,
    name,
    amount,
    comment,
    id,
    paymentType
  ) {
    //alert("successfully charged " + id);
    //email and show success

    let url = "";
    let body = {
      email: email,
      name: name,
      amount: amount,
      comment: comment,
      id: id,
    };

    url = "/donationSuccessPayment";

    // eslint-disable-next-line no-undef
    console.log("sendSuccessToServer " + email + " amount is " + amount);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.error) {
        return { error: data.error };
      } else {
        return data;
      }
    } catch (err) {
      return { error: err.message };
    }

  }

  // Format a price (assuming a two-decimal currency like EUR or USD for simplicity).
  formatPrice(amount, currency) {
    const price = (amount / 100).toFixed(2);
    const numberFormat = new Intl.NumberFormat(['en-US'], {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
    });
    return numberFormat.format(price);
  }
}

window.store = new Store();
