import {BaseDto} from '../core/base.dto';
import {Bool} from '../../enum/bool.enum';
import {ProductDto} from '../product/product.dto';

export class CategoryDto extends BaseDto {
  name: string;

  description: string;

  position: number;

  isRootCategory: Bool;

  image: string;

  children: CategoryDto[];

  parent: CategoryDto;

  products: ProductDto[];
}
