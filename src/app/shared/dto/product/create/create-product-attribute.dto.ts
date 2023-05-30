import {ProductAttributeDto} from '../product-attribute.dto';
import {AttributeIdDto} from './attribute-id.dto';

export class CreateProductAttributeDto extends ProductAttributeDto {
  productID: string;

  attributesID: AttributeIdDto[];
}
