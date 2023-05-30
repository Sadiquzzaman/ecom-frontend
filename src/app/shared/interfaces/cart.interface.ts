import {ProductDto} from '../dto/product/product.dto';
import {ProductAttributeDto} from '../dto/product/product-attribute.dto';

export interface CartInterface {
  product: ProductDto;
  productAttribute: ProductAttributeDto;
  quantity: number;
}
