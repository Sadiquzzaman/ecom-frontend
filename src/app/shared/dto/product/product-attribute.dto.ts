import {BaseDto} from '../core/base.dto';
import {ProductDto} from './product.dto';
import {AttributeDto} from './attribute/attribute.dto';

export class ProductAttributeDto extends BaseDto {
  reference: string;

  quantity: number;

  price: number;

  discount: number;

  wholesalePrice: number;

  additionalShippingCost: number;

  image: string;

  product: ProductDto;

  attributes: AttributeDto[];
}
