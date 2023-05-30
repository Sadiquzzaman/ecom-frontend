import {BaseDto} from '../core/base.dto';
import {OrderDto} from '../order/order.dto';
import {CartDetailsDto} from './cart-details.dto';
import {UserDto} from '../user/user.dto';

export class CartDto extends BaseDto {
  order: OrderDto;

  user: UserDto;

  cartDetails: CartDetailsDto[];
}
