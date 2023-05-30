import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from '../../core/enum/microservices.enum';
import { ApiConfigService } from '../../core/services/api-config.service';
import { ResponseDto } from '../dto/reponse/response.dto';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  productReviewUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `product-review`;
  shopReviewUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `shop-review`;

  constructor(
    private httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {
  }

  createShopReview = (data: any, shopId: string): Observable<ResponseDto> => {
    const creatShopReview = {shopID: shopId, shopRating: data.starRate, shopReview: data.review};
    return this.httpClient.post(this.shopReviewUrl, creatShopReview) as Observable<ResponseDto>;
  }

  createProductReview = (data: any, productId: string): Observable<ResponseDto> => {
    const creatProductReview = {productID: productId, productRating: data.starRate, productReview: data.review};
    return this.httpClient.post(this.productReviewUrl, creatProductReview) as Observable<ResponseDto>;
  }
}
