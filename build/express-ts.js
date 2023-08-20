"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/camelcase */
var stripe_1 = __importDefault(require("stripe"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var path_1 = __importDefault(require("path"));
var winston_1 = __importDefault(require("winston"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var emailGenerator_1 = __importDefault(require("./emails/emailGenerator"));
var sql_db_1 = require("./sql_db/sql_db");
require('dotenv').config({ path: "./.env" });
var stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
});
var MIN_GIFT_AMOUNT = 20;
var app = express_1.default();
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
// initialize logger
var logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    defaultMeta: { service: 'credit-gifting-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'combined.log' }),
    ],
});
// initialize node mailer
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});
// initialize db
var giftingRecords = new sql_db_1.GiftingRecords();
/**
 * Creates the payment intent and returns the client_secret back to the client.
 */
app.post('/paymentIntent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var amount, senderEmail, senderPhoneNumber, recipientEmail, recipientName, senderName, paymentIntent, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                amount = parseInt(req.body.amount);
                senderEmail = req.body.senderEmail;
                senderPhoneNumber = req.body.senderPhoneNumber;
                recipientEmail = req.body.recipientEmail;
                recipientName = req.body.recipientName;
                senderName = req.body.senderName;
                if (!isValidAmount(amount)) {
                    res.status(400).send({
                        error: amount + " is an invalid amount. The valid gift options are $50, $100, $200, $500, $1000",
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, stripe.paymentIntents.create({
                        amount: amount * 100,
                        currency: 'cad',
                        payment_method_types: ['card'],
                        metadata: {
                            type: 'ashramGiftingPlatform',
                            senderEmail: senderEmail,
                            senderPhoneNumber: senderPhoneNumber,
                            recipientEmail: recipientEmail,
                        },
                    })];
            case 2:
                paymentIntent = _a.sent();
                return [4 /*yield*/, giftingRecords.addGiftingRecord({
                        paymentIntentID: paymentIntent.id,
                        recipientName: recipientName,
                        recipientEmail: recipientEmail,
                        senderName: senderName,
                        senderEmail: senderEmail,
                        senderPhoneNumber: senderPhoneNumber,
                        amount: amount,
                    })];
            case 3:
                _a.sent();
                res.json({ client_secret: paymentIntent.client_secret });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                res.status(500);
                return [2 /*return*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post('/sendSuccessEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentIntentID, record_1, discountCodeRecord, recipientMailOptions, confirmationMailOptions, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paymentIntentID = req.body.id;
                logger.info('sending success email ' + paymentIntentID);
                if (!paymentIntentID || !req.body.message) {
                    res.status(400).send({ error: 'bad request' });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, giftingRecords.getGiftingRecord(paymentIntentID)];
            case 2:
                record_1 = _a.sent();
                return [4 /*yield*/, giftingRecords.getDiscountInfoWithMinimumUsesForAmount(record_1.amount)];
            case 3:
                discountCodeRecord = _a.sent();
                logger.info("discountCodeID for amount " + record_1.amount + " is " + discountCodeRecord.discountCodeID + " with num of uses " + discountCodeRecord.numUses);
                return [4 /*yield*/, giftingRecords.addGiftingSuccess(paymentIntentID, discountCodeRecord.discountCodeID)];
            case 4:
                _a.sent();
                recipientMailOptions = {
                    from: process.env.ADMIN_EMAIL,
                    to: record_1.recipientEmail,
                    subject: 'Canadian gifting platform',
                    html: emailGenerator_1.default.generateRecepientEmail(record_1.senderName, record_1.recipientName, req.body.message, discountCodeRecord.discountCodeID)
                };
                return [4 /*yield*/, transporter.sendMail(recipientMailOptions, function (err, info) {
                        if (err) {
                            logger.error("Failed to notify recipient name = " + record_1.recipientName + ", email = " + record_1.recipientEmail + ", paymentID = " + record_1.paymentIntentID);
                        }
                    })];
            case 5:
                _a.sent();
                confirmationMailOptions = {
                    from: process.env.ADMIN_EMAIL,
                    to: record_1.senderEmail,
                    subject: 'Canadian gifting platform',
                    html: emailGenerator_1.default.generateConfirmationEmail(record_1.senderName, record_1.recipientName)
                };
                return [4 /*yield*/, transporter.sendMail(confirmationMailOptions, function (err, info) {
                        if (err) {
                            logger.error(err);
                            logger.error("Failed to notify sender name = " + record_1.senderName + ", email = " + record_1.senderEmail + ", paymentID = " + record_1.paymentIntentID);
                        }
                    })];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                err_2 = _a.sent();
                logger.error("error in sending success email " + err_2 + " payment_intent_id is " + paymentIntentID);
                res.sendStatus(500);
                return [2 /*return*/];
            case 8:
                res.sendStatus(200);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Returns the stripe publishable key to the client.
 */
app.get('/config', function (req, res) {
    res.status(200).send({
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        stripeCountry: 'CA',
        country: 'CA',
        currency: 'cad',
        paymentMethods: ['card'],
    });
});
app.get('/success', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.sendFile(path_1.default.join(__dirname + '/../public/index.html'));
        return [2 /*return*/];
    });
}); });
app.get('/checkout', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var amount;
    return __generator(this, function (_a) {
        amount = parseInt(req.query.amount);
        if (!isValidAmount(amount)) {
            if (!isValidAmount(amount)) {
                res.status(400).send({
                    error: amount + " is an invalid amount. The valid gift options are $50, $100, $200, $500, $1000",
                });
                return [2 /*return*/];
            }
        }
        res.sendFile(path_1.default.join(__dirname + '/../public/checkout.html'));
        return [2 /*return*/];
    });
}); });
app.listen(3000, function () {
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston_1.default.transports.Console({
            format: winston_1.default.format.simple(),
        }));
    }
    try {
        giftingRecords.initializeDB();
    }
    catch (err) {
        logger.error('Could not connect to giftingRecords DB');
        return;
    }
    console.log('Gifting stripe server is listening on port 3000');
});
/**
 * Returns if amount entered is a valid option.
 * @param Amount amount
 * @returns
 */
function isValidAmount(Amount) {
    if (Amount === 50 || Amount === 100 || Amount === 200 || Amount === 500 || Amount === 1000) {
        return true;
    }
    return false;
}
