"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRecords = void 0;
const sqlite3 = require('sqlite3').verbose();
class PaymentRecords {
    initializeDB() {
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.db_connection = new sqlite3.Database('./sql_db/payments.db', (err) => {
            if (!err) {
                console.log('Connected to payments.db');
            }
            else {
                throw new Error('Could not connect to payments.db');
            }
        });
        try {
        }
        catch (err) {
            console.log("error running initial db scripts");
            throw err;
        }
        // initialize tables
        this.db_connection.run(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      phone_number TEXT,
      loc_postalCode TEXT,
      loc_city TEXT,
      loc_street TEXT,
      loc_province TEXT,
      info TEXT
    );`);
        this.db_connection.run(`
      CREATE TABLE IF NOT EXISTS payment_intents (
          payment_intent_id TEXT PRIMARY KEY,
          user_email TEXT,
          amount DOUBLE,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          donation_category nvarchar(100),
          other_info VARCHAR,
          FOREIGN KEY (user_email) REFERENCES users(email)
      );`);
        this.db_connection.run(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_intent_id TEXT PRIMARY KEY,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_success INT DEFAULT 1,
        info TEXT,
        FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(payment_intent_id)
      );`);
        this.db_connection.run(`
    CREATE TABLE IF NOT EXISTS payments (
      payment_intent_id TEXT PRIMARY KEY,
      transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_success INT DEFAULT 1,
      info TEXT,
      FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(payment_intent_id)
    );`);
        this.db_connection.run(`
    CREATE TABLE IF NOT EXISTS ukraine_yoga_march_registration (
      email_address TEXT PRIMARY KEY,
      registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      first_name TEXT,
      last_name TEXT,
      phone_number TEXT
    );`);
        this.db_connection.run(`
    CREATE TABLE IF NOT EXISTS user_site_stripecustomerid (
      user_email TEXT,
      site TEXT,
      stripe_customer_id TEXT
      addedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users(email)
      PRIMARY KEY (user_email, site)
    );`);
    }
    async addPaymentSuccess(PaymentIntentID) {
        return new Promise((resolve, reject) => {
            const query = `
            INSERT INTO payments(payment_intent_id, is_success) VALUES(?, ?)
            `;
            const parameters = [PaymentIntentID, 1];
            this.db_connection.run(query, parameters, (err) => {
                if (err) {
                    reject(err);
                }
                console.log(`addPaymentSuccess ${PaymentIntentID}`);
                resolve();
            });
        });
    }
    async addUserIfDoesNotExist(Record) {
        return new Promise((resolve, reject) => {
            //console.log("createUserIfDoesNotExist " + JSON.stringify(Record));
            const query = `
            INSERT INTO users(email, first_name, last_name, phone_number, loc_postalCode, loc_city, loc_street, loc_province)
              SELECT '${Record.email}', '${Record.firstName}', '${Record.lastName}', '${Record.phoneNumber}', '${Record.locPostalCode}',
                '${Record.locCity}', '${Record.locStreet}', '${Record.locProvince}'
              WHERE NOT EXISTS
                    (
                      SELECT 1 FROM users WHERE email='${Record.email}'
                    );
            `;
            //console.log("addUserIfDoesNotExist query is " + query);
            this.db_connection.run(query, (err) => {
                if (err) {
                    console.log("addUserIfDoesNotExist db error " + err);
                    reject(err);
                }
            });
            resolve();
        });
    }
    async insertUserStripeCustomerID(UserEmail, StripeCustomerID, Site) {
        return new Promise((resolve, reject) => {
            //console.log("createUserIfDoesNotExist " + JSON.stringify(Record));
            const query = `
      INSERT INTO user_site_stripecustomerid(user_email, site, stripe_customer_id)
      VALUES
      ('${UserEmail}', '${Site}', '${StripeCustomerID}');      
      `;
            this.db_connection.run(query, (err) => {
                if (err) {
                    console.log("insertUserStripeCustomerID db error " + err);
                    reject(err);
                }
            });
            resolve();
        });
    }
    async updateUserLocation(UserRecord) {
        return new Promise((resolve, reject) => {
            //console.log("createUserIfDoesNotExist " + JSON.stringify(Record));
            const query = `
      UPDATE users
      SET loc_city = '${UserRecord.locCity}', loc_postalCode='${UserRecord.locPostalCode}', loc_province='${UserRecord.locProvince}', loc_street='${UserRecord.locStreet}'
      WHERE email='${UserRecord.email}';   
      `;
            this.db_connection.run(query, (err) => {
                if (err) {
                    console.log("updateUserLocation db error " + err);
                    reject(err);
                }
            });
            resolve();
        });
    }
    async getUserStripeCustomerID(Email, Site) {
        return new Promise((resolve, reject) => {
            const query = `
      SELECT  u.email, us.stripe_customer_id
      FROM users u left join user_site_stripecustomerid us on u.email=us.user_email and us.site = '${Site}'
      where u.email='${Email}';
      `;
            this.db_connection.get(query, (err, row) => {
                if (err) {
                    console.log("error sql_db getUserSripeCustomerID " + err);
                    reject("error");
                    return;
                }
                else {
                    console.log("getUserStripeCustomerID row returned " + JSON.stringify(row));
                    if (row == null) {
                        //user doesn't exist
                        resolve({
                            userExists: false,
                            stripeCustomerID: null
                        });
                    }
                    else {
                        resolve({
                            userExists: true,
                            stripeCustomerID: row['stripe_customer_id']
                        });
                    }
                    return;
                }
            });
        });
    }
    async addPaymentIntent(Record, Site) {
        return new Promise((resolve, reject) => {
            const query = `
            INSERT INTO payment_intents(payment_intent_id, user_email, amount, donation_category, other_info, site) VALUES(?, ?, ?, ?, ?, ?);
            `;
            const parameters = [
                Record.paymentIntentID,
                Record.userEmail,
                Record.amount,
                Record.donationCategory,
                Record.otherInfo,
                Site
            ];
            this.db_connection.run(query, parameters, (err) => {
                if (err) {
                    console.log("adding payment intent error " + err);
                    reject(err);
                }
            });
            console.log("addPaymentIntent " + JSON.stringify(Record));
            resolve();
        });
    }
    async checkIfUkraineUserIsAlreadyRegistered(Email) {
        return new Promise((resolve, reject) => {
            const query = `
      SELECT email_address FROM ukraine_yoga_march_registration
      WHERE email_address = ?;
      `;
            const parameters = [
                Email
            ];
            this.db_connection.get(query, parameters, (err, row) => {
                if (err) {
                    console.log("error checking if ukraine user is already registered " + err);
                    reject(true);
                    return;
                    // reject(false);
                }
                else {
                    //console.log("ukraine user check: " + JSON.stringify(row));
                    if (row == null) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                    return;
                }
            });
        });
    }
    async addUkraineYogaRegistration(Record) {
        return new Promise((resolve, reject) => {
            const query = `
      INSERT INTO ukraine_yoga_march_registration(first_name, last_name, email_address, phone_number)
      VALUES
      (?, ?, ?, ?);
      `;
            const parameters = [
                Record.firstName,
                Record.lastName,
                Record.email,
                Record.phoneNumber
            ];
            this.db_connection.run(query, parameters, (err) => {
                if (err) {
                    console.log("adding ukraine yoga registration intent error " + err);
                    resolve(false);
                    return;
                    // reject(false);
                }
                else {
                    resolve(true);
                    return;
                }
            });
        });
    }
}
exports.PaymentRecords = PaymentRecords;
