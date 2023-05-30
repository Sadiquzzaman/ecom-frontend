import {ShopDto} from '../shop.dto';

export class CreateShopDto extends ShopDto {
  merchantID: string;

  shopTypeID: string;
}
