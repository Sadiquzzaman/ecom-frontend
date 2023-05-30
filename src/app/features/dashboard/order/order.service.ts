import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from 'src/app/core/enum/microservices.enum';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { ResponseDto } from '../../../shared/dto/reponse/response.dto';

@Injectable()
export class OrderService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + `orders`;
  mainBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER);
  invoiceUrl =
    this.apiConfigService.getUrl(MicroserviceURL.PAYMENT) + `invoices`;
  orderBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER);

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  paymentMethod = {
    0: 'Not Selected',
    1: 'Cash on Delivery',
    2: 'Online Payment',
  };

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    status = 0,
    fromDate: string = '',
    toDate: string = ''
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&status=${status}&fromDate=${fromDate}&toDate=${toDate}`
    );

  findInvoiceByByID = (id: string): Observable<ResponseDto> =>
    this._httpClient.get(`${this.invoiceUrl}/${id}`) as Observable<ResponseDto>;

  findByID = (id: string): Observable<ResponseDto> =>
    this._httpClient.get(`${this.baseUrl}/${id}`) as Observable<ResponseDto>;

  changeStatusByID = (
    id: string,
    status: { status: number }
  ): Observable<ResponseDto> =>
    this._httpClient.put(
      `${this.baseUrl}/change-status/${id}`,
      status
    ) as Observable<ResponseDto>;

  remove = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);

  shippingStatusByOrderID = (id: string): Observable<ResponseDto> =>
    this._httpClient.get(
      `${this.mainBaseUrl}admin-shipping/shop-invoice-shipping-status?orderId=${id}`
    ) as Observable<ResponseDto>;

  findShopInvoiceByID = (id: string): Observable<ResponseDto> =>
    this._httpClient.get(
      `${this.orderBaseUrl}customer-refund/order-details/${id}`
    ) as Observable<ResponseDto>;

  getAllReasons = (): Observable<any> =>
    this._httpClient.get(`${this.orderBaseUrl}refund-reason`);

  createRefundRequest = (dto: any): Observable<any> =>
    this._httpClient.post(
      `${this.orderBaseUrl}customer-refund/create-refund-request`,
      dto
    );
}
