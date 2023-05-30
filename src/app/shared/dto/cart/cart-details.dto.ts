import {BaseDto} from '../core/base.dto';
import {ProductDto} from '../product/product.dto';
import {ProductAttributeDto} from '../product/product-attribute.dto';
import {CartDto} from './cart.dto';

export class CartDetailsDto extends BaseDto {
  quantity: number;

  product: ProductDto;

  productAttribute: ProductAttributeDto;

  cart: CartDto;
}
