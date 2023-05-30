import { BaseDto } from '../core/base.dto';
import { UserDto } from '../user/user.dto';
import { ShopDto } from './shop.dto';

export class ShopReviewDto extends BaseDto {
  shopRating: number;
  shopReview: string;
  user: UserDto;
  shop: ShopDto;
}
