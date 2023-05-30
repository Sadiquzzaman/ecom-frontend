import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RefundService {
  orderBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER);
  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);

  maxHeight = '90vh';
  width = '90vh';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  refundRequestList = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    refundStatus: string,
    assignStatus: number,
    isAdmin: boolean = true,
    customerID: string = '',
    fromDate: string = '',
    toDate: string = ''
  ): Observable<any> => {
    console.log(assignStatus);
    console.log(isAdmin);
    console.log(customerID);

    if (isAdmin) {
      return this._httpClient.get(
        `${this.orderBaseUrl}admin-refund/get-refund-request-list?page=${page}&limit=${limit}&sort=${sort}&order=${order}&refundStatus=${refundStatus}&assignStatus=${assignStatus}&customerID=${customerID}&fromDate=${fromDate}&toDate=${toDate}`
      );
    } else {
      return this._httpClient.get(
        `${this.orderBaseUrl}customer-refund/get-customer-refund-request-list?page=${page}&limit=${limit}&sort=${sort}&order=${order}&fromDate=${fromDate}&toDate=${toDate}`
      );
    }
  };

  transporterAssignedPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    shippingStatus: number,
    assignStatus: number
  ): Observable<any> =>
    this._httpClient.get(
      `${this.orderBaseUrl}admin-refund-delivery-assignment/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shippingStatus=${shippingStatus}&assignStatus=${assignStatus}`
    );

  approvedListPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.orderBaseUrl}?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

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

  findByID = (id: string, refundStatus: string = ''): Observable<any> => {
    if (refundStatus == '') {
      return this._httpClient.get(
        `${this.orderBaseUrl}admin-refund/${id}/${refundStatus}`
      );
    } else {
      return this._httpClient.get(`${this.orderBaseUrl}customer-refund/${id}`);
    }
  };

  approveRefundRequest = (id: string, dto: any): Observable<any> =>
    this._httpClient.patch(
      `${this.orderBaseUrl}admin-refund/update-refund-request-status/${id}`,
      dto
    );

  assignTransporterForCustomerPickUp = (dto: any): Observable<any> =>
    this._httpClient.post(
      `${this.orderBaseUrl}admin-refund-delivery-assignment`,
      dto
    );

  update = (id: string, status: { status: number }): Observable<any> =>
    this._httpClient.put(
      `${this.orderBaseUrl}admin-refund-delivery-assignment/update/status/${id}`,
      status
    );

}
