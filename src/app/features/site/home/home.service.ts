import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { ResponseDto } from './../../../shared/dto/reponse/response.dto';
import { FilterOption } from '../../../core/dto/filter-option.dto';
import { map } from 'rxjs/operators';

@Injectable()
export class HomeService {
  shopUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + 'shops';
  shopSearchUrl =
    this.apiConfigService.getUrl(MicroserviceURL.SEARCH) + 'shops';
  productUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + 'products';
  shopReviewUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + 'shop-review';

  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'users';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  getByTypePagination(
    catID: string,
    page: number,
    limit: number,
    filter: FilterOption
  ): Observable<any> {
    return this._httpClient.get(
      `${this.shopUrl}/find/type?id=${catID}&page=${page}&limit=${limit}&rating=${filter.rating}&algorithm=${filter.algorithm}`
    );
  }

  getByShopPagination(
    catID: string,
    page: number,
    limit: number
  ): Observable<any> {
    return this._httpClient.get(
      `${this.productUrl}/find/shop?id=${catID}&page=${page}&limit=${limit}`
    );
  }

  getByShopLocationPagination(
    page: number,
    limit: number,
    lat: number,
    lng: number
  ): Observable<any> {
    return this._httpClient.get(
      `${this.shopSearchUrl}/search/location?p=${page}&l=${limit}&lat=${lat}&lng=${lng}`
    );
  }

  getShopByKeyPagination(
    page: number,
    limit: number,
    search: string
  ): Observable<any> {
    return this._httpClient.get(
      `${this.shopSearchUrl}/search/?q=${search}&p=${page}&l=${limit}`
    );
  }

  getShopReviews = (id: string): Observable<ResponseDto> =>
    this._httpClient.get(
      `${this.shopReviewUrl}/shop/${id}`
    ) as Observable<ResponseDto>;

  getFollowingShops = (id: string): Observable<any> =>
    this._httpClient
      .get(`${this.userBaseUrl}/following-shops`)
      .pipe(map((res: any) => res?.payload?.data?.followingShops || []));
}
