import {OrderDto} from '../order.dto';

export class CreateOrderDetailsDto extends OrderDto {
  productID: string;

  productAttributeID: string;

  orderID: string;
}
