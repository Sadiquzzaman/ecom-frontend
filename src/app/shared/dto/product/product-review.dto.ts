import { BaseDto } from '../core/base.dto';
import { UserDto } from '../user/user.dto';
import { ProductDto } from './product.dto';

export class ProductReviewDto extends BaseDto {
  productRating: number;
  productReview: string;
  user: UserDto;
  product: ProductDto;
}
