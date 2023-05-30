export interface ProductAttributeInterface {
  reference: string;
  quantity: number;
  price: number;
  weight: number;
  purchasedPrice: number;
  discount: number;
  wholesalePrice: number;
  additionalShippingCost: number;
  image: string;
  productID: string;
  attributesID: Array<{ id: string }>;
}
