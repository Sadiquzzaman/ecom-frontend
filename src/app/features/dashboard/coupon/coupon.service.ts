import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `coupon`;
  shopUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `shops`;
  productUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `products`;
  categoryUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `categories`;
  thanaUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + `thanas`;
  userUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + `users`;

  constructor(
    private apiConfigService: ApiConfigService,
    private readonly _httpClient: HttpClient
  ) {}

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    couponCode: string = '',
    fromDate: string = '',
    toDate: string = ''
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&couponCode=${couponCode}&fromDate=${fromDate}&toDate=${toDate}`
    );

  create = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);

  getAll = (): Observable<any> => this._httpClient.get(`${this.baseUrl}`);

  getAllShopByPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.shopUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  getAllProductByPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.productUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  getAllCategoryByPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.categoryUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  getAllThanaByPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.thanaUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  // getAllUserByPagination = (
  //   page: number,
  //   limit: number,
  //   sort: string,
  //   order: string
  // ): Observable<any> =>
  //   this._httpClient.get(
  //     `${this.userUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
  //   );

  getAllUserByPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    label: string[],
    approveStatus: string = '',
    name: string = '',
    email: string = '',
    phone: string = ''
  ): Observable<any> =>
    this._httpClient.get(
      `${this.userUrl}/admin-pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&label=${label}&approveStatus=${approveStatus}&name=${name}&email=${email}&phone=${phone}`
    );
}
