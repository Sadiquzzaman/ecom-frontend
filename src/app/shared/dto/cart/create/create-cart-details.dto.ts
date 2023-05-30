import {CartDetailsDto} from '../cart-details.dto';

export class CreateCartDetailsDto extends CartDetailsDto {
  productID: string;

  productAttributeID: string;

  quantity: number;
}
