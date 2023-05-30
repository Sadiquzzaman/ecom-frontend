import {OrderDto} from '../order.dto';

export class CreateOrderDto extends OrderDto {
  userID: string;

  cartID: string;
}
