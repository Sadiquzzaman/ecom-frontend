import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransporterRefundService {
  paymentBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);
  orderBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER);
  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  assignedRefundRequestPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    shippingStatus: number,
    refundApprovalBool: string,
    assignStatus: number,
    isAdmin: boolean = true,
    customerId: string = '',
    transporterId: string = '',
    fromDate: string = '',
    toDate: string = ''
  ): Observable<any> => {
    if (isAdmin) {
      let url = `${this.orderBaseUrl}admin-refund-delivery-assignment/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shippingStatus=${shippingStatus}&refundApprovalBool=${refundApprovalBool}&customerId=${customerId}&transporterId=${transporterId}&fromDate=${fromDate}&toDate=${toDate}`;
      if (assignStatus != 404) {
        url += `&assignStatus=${assignStatus}`;
      }
      return this._httpClient.get(url);
    } else {
      let url = `${this.orderBaseUrl}transporter-refund-delivery-assignment/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shippingStatus=${shippingStatus}&refundApprovalBool=${refundApprovalBool}&customerId=${customerId}&fromDate=${fromDate}&toDate=${toDate}`;
      if (assignStatus != 404) {
        url += `&assignStatus=${assignStatus}`;
      }
      return this._httpClient.get(url);
    }
  };

  findByID = (id: string, refundStatus: string = ''): Observable<any> => {
    if (refundStatus == '') {
      return this._httpClient.get(
        `${this.orderBaseUrl}admin-refund/${id}/${refundStatus}`
      );
    } else {
      return this._httpClient.get(`${this.orderBaseUrl}customer-refund/${id}`);
    }
  };

  update = (id: string, status: { status: number }): Observable<any> =>
    this._httpClient.put(
      `${this.orderBaseUrl}transporter-refund-delivery-assignment/update/status/${id}`,
      status
    );

  approveRefundRequest = (id: string, dto: any): Observable<any> =>
    this._httpClient.patch(
      `${this.orderBaseUrl}admin-refund/update-refund-request-status/${id}`,
      dto
    );

  rejectRefundRequest = (
    id: string,
    status: { step: number }
  ): Observable<any> =>
    this._httpClient.patch(
      `${this.orderBaseUrl}admin-refund/reject-refund-request/${id}`,
      status
    );
}
