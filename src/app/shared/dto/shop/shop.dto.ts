import { BaseDto } from '../core/base.dto';
import { Point } from '../location/point';
import { ProductDto } from '../product/product.dto';
import { MerchantDto } from '../user/merchant.dto';
import { ShopTypeDto } from './shop-type.dto';

export class ShopDto extends BaseDto {
  name: string;

  domain: string;

  url: string;

  location: string;

  geoLocation: Point;

  rating: number;

  shopProfileImage: string;

  shopCoverImage: string;

  shopType: ShopTypeDto;

  merchant: MerchantDto;

  products: ProductDto[];
}
