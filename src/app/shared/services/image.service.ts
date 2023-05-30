import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageType } from '../../core/enum/image-type.enum';
import { ApiConfigService } from '../../core/services/api-config.service';

@Injectable()
export class ImageService {
  constructor(
    private httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  loadImage(fileName: string, type: ImageType): string {
    return this.generateImageUrl(fileName, type);
  }

  private generateImageUrl(fileName: string, type: ImageType): string {
    let url = this.apiConfigService.getImageUrl();
    switch (type) {
      // check: may be we dont need this ImageType.PROFILE
      case ImageType.PROFILE: {
        url += 'profile/';
        break;
      }
      case ImageType.USER_PROFILE: {
        url += 'user/profile/';
        break;
      }
      case ImageType.CATEGORY: {
        url += 'category/';
        break;
      }
      case ImageType.PRODUCT_SMALL: {
        url += 'product/d300/';
        break;
      }
      case ImageType.PRODUCT_BIG: {
        url += 'product/d600/';
        break;
      }
      case ImageType.BANNER: {
        url += 'banner/';
        break;
      }
      case ImageType.SHOP_SLIDE: {
        url += 'shop/slide/';
        break;
      }
      case ImageType.SHOP_TYPE: {
        url += 'shoptype/';
        break;
      }
      case ImageType.PRODUCT_SLIDE: {
        url += 'product/slide/';
        break;
      }
      case ImageType.SHOP_COVER: {
        url += 'shop/cover/';
        break;
      }
      case ImageType.SHOP_PROFILE_SMALL: {
        url += 'shop/d300/';
        break;
      }
      case ImageType.SHOP_PROFILE_BIG: {
        url += 'shop/d600/';
        break;
      }
      case ImageType.BRAND_COVER: {
        url += 'brand/cover/';
        break;
      }
      case ImageType.PAYMENT: {
        url += 'withdrawal/d600/';
        break;
      }
    }
    return url + fileName;
  }
}
