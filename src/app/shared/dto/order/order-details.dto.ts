import {BaseDto} from '../core/base.dto';
import {ProductDto} from '../product/product.dto';
import {ProductAttributeDto} from '../product/product-attribute.dto';
import {OrderDto} from './order.dto';

export class OrderDetailsDto extends BaseDto {
  quantity: number;

  product: ProductDto;

  productAttribute: ProductAttributeDto;

  order: OrderDto;
}
