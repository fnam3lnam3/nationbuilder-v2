export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_Se3xZpUe1JFc77',
    priceId: 'price_1RilpvLExa1bTcBlQ0PfFsvB',
    name: 'Nationleader Subscription',
    description: 'Access premium features, such as creation of up to 30 Saved Nations and first notice of Nationleader feature releases. We plan to release social features and sharing to Nationleader subscribers first. Coming soon!',
    mode: 'subscription'
  }
];