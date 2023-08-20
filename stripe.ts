import Stripe from "stripe";
import { SiteType } from "./objects";

 
class StripeClient {

  private client: Stripe;

  private siteStripeMap: Record<string, Stripe>;

  constructor(){

    try {

      this.client = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27',
      });
      this.siteStripeMap = {};
      this.siteStripeMap[SiteType.AARYA] = this.client;

    } catch (err){
      console.log("error initializing stripe client " + err);
      throw err;
    }
  }

  public get(siteType: string):Stripe {
    return this.siteStripeMap[siteType];
  }

}

export class AppStripeClient {
  private static stripeClient: StripeClient;
  private static isInitialized: boolean = false;

  private constructor() {}

  static getStripeClient(): StripeClient {
    if (!this.isInitialized) {
      this.stripeClient = new StripeClient();
    }
    
    return this.stripeClient;
  }

}