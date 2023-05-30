import {BaseDto} from '../../core/base.dto';
import {AttributeGroupDto} from './attribute-group.dto';
import {ProductAttributeDto} from '../product-attribute.dto';

export class AttributeDto extends BaseDto {
  color: string;

  name: string;

  description: string;

  position: number;

  attributeGroup: AttributeGroupDto;

  productAttributes: ProductAttributeDto[];
}
