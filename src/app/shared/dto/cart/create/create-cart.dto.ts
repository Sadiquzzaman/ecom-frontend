import {CartDto} from '../cart.dto';
import {CreateCartDetailsDto} from './create-cart-details.dto';

export class CreateCartDto extends CartDto {
  userID: string;

  cartDetails: CreateCartDetailsDto[];
}
