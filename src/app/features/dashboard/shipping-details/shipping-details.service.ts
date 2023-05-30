import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable()
export class ShippingDetailsService {
  paymentBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);
  orderBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER);
  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly token: TokenStorageService
  ) {}

  adminShopInvPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    // shopId: string,
    fromDate: string,
    toDate: string,
    assignStatus: number
  ): Observable<any> =>
    this._httpClient.get(
      `${this.orderBaseUrl}admin-shipping/get-shop-invoice?page=${page}&limit=${limit}&sort=${sort}&order=${order}&fromDate=${fromDate}&toDate=${toDate}&assignStatus=${assignStatus}`
    );

  merchantShopInvoicePagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    assignStatus: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.orderBaseUrl}merchant-shipping/get-shop-invoice?page=${page}&limit=${limit}&sort=${sort}&order=${order}&assignStatus=${assignStatus}`
    );

  shopInvoicePagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    assignStatus: string,
    shippingStatus: string,
    shopId: string,
    customerId: string,
    transporterId: string,
    fromDate: string,
    toDate: string
  ): Observable<any> => {
    let result = of({});
    let api = this.orderBaseUrl;

    if (this.token.isAdmin() || this.token.isShopManager()) {
      api += 'admin-shipping';
    } else {
      if (this.token.isMerchant()) {
        api += 'merchant-shipping';
      }
    }

    if (api) {
      let fullApi = `${api}/get-shop-invoice?page=${page}&limit=${limit}&sort=${sort}&order=${order}&assignStatus=${assignStatus}&shippingStatus=${shippingStatus}&shopId=${shopId}&customerId=${customerId}&transporterId=${transporterId}&fromDate=${fromDate}&toDate=${toDate}`;
      result = this._httpClient.get(fullApi);
    }

    return result;
  };

  getAllTransporters = (): Observable<any> => {
    return this._httpClient.get(`${this.userBaseUrl}users/transporter`).pipe(
      map((res: any) => res?.payload?.data || {}),
      map((shops: any[]) =>
        shops.map((data: any) => ({
          id: data.id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          email: data.user.email,
        }))
      )
    );
  };

  assignTransporter = (dto: any): Observable<any> =>
    this._httpClient.post(
      `${this.orderBaseUrl}admin-shipping/shipment-delivery-assignment`,
      dto
    );

  // this._httpClient.get(`${this.userBaseUrl}users/transporter`);

  // adminPagination = (
  //   page: number,
  //   limit: number,
  //   sort: string,
  //   order: string,
  //   label: string[]
  // ): Observable<any> =>
  //   this._httpClient.get(
  //     `${this.userBaseUrl}/admin-pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&label=${label}`
  //   );

  // pagination = (
  //   page: number,
  //   limit: number,
  //   sort: string,
  //   order: string
  // ): Observable<any> =>
  //   this._httpClient.get(
  //     `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
  //   );

  // create = (dto: any): Observable<any> =>
  //   this._httpClient.post(`${this.baseUrl}`, dto);

  // update = (id: string, dto: any): Observable<any> =>
  //   this._httpClient.put(`${this.baseUrl}/${id}`, dto);

  // uploadCoverImage = (filename: string, type: number) =>
  //   this._httpClient.post(`${this.imageUrl}/promotion/cover`, {
  //     filename,
  //     type,
  //   });

  // uploadCoverImageRedis = (image: File): Observable<any> => {
  //   const formData = new FormData();
  //   formData.append('image', image);
  //   return this._httpClient.post(
  //     `${this.imageUrl}/promotion-redis/cover`,
  //     formData
  //   );
  // };

  // remove = (id: string | null): Observable<any> =>
  //   this._httpClient.delete(`${this.baseUrl}/${id}`);
}
