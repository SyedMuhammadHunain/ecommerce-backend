export class CheckoutDto {
  items: { productId: string; quantity: number; price: number }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}
