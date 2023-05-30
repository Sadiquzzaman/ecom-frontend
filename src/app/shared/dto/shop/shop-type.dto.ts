import {BaseDto} from '../core/base.dto';
import {ShopDto} from './shop.dto';

export class ShopTypeDto extends BaseDto {
  name: string;

  shops: ShopDto[];
}
