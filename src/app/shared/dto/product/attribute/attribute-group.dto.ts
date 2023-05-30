import {BaseDto} from '../../core/base.dto';
import {AttributeDto} from './attribute.dto';
import {Bool} from '../../../enum/bool.enum';

export class AttributeGroupDto extends BaseDto {
  isColorGroup: Bool;

  name: string;

  description: string;

  position: number;

  attributes: AttributeDto[];
}
