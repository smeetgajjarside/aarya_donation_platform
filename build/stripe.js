"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppStripeClient = void 0;
const stripe_1 = __importDefault(require("stripe"));
const objects_1 = require("./objects");
class StripeClient {
    constructor() {
        try {
            this.client = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
                apiVersion: '2020-08-27',
            });
            this.siteStripeMap = {};
            this.siteStripeMap[objects_1.SiteType.AARYA] = this.client;
        }
        catch (err) {
            console.log("error initializing stripe client " + err);
            throw err;
        }
    }
    get(siteType) {
        return this.siteStripeMap[siteType];
    }
}
class AppStripeClient {
    constructor() { }
    static getStripeClient() {
        if (!this.isInitialized) {
            this.stripeClient = new StripeClient();
        }
        return this.stripeClient;
    }
}
exports.AppStripeClient = AppStripeClient;
AppStripeClient.isInitialized = false;
