import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroserviceURL } from '../../core/enum/microservices.enum';
import { ApiConfigService } from '../../core/services/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class RefundService {
  orderBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER);
  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  // approvedRefundListPaginationForAdmin = (
  //   page: number,
  //   limit: number,
  //   sort: string,
  //   order: string,
  //   refundStatus: string,
  //   assignStatus: number
  // ): Observable<any> =>
  //   this._httpClient.get(
  //     `${this.orderBaseUrl}customer-refund/get-refund-request-list?page=${page}&limit=${limit}&sort=${sort}&order=${order}&refundStatus=${refundStatus}&assignStatus=${assignStatus}`
  //   );

  // transporterAssignedPagination = (
  //   page: number,
  //   limit: number,
  //   sort: string,
  //   order: string,
  //   shippingStatus: number,
  //   assignStatus: number
  // ): Observable<any> =>
  //   this._httpClient.get(
  //     `${this.orderBaseUrl}admin-refund-delivery-assignment/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shippingStatus=${shippingStatus}&assignStatus=${assignStatus}`
  //   );

  // approvedListPagination = (
  //   page: number,
  //   limit: number,
  //   sort: string,
  //   order: string
  // ): Observable<any> =>
  //   this._httpClient.get(
  //     `${this.orderBaseUrl}?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
  //   );

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

  // needed
  findByID = (id: string, refundStatus: string = ''): Observable<any> => {
    if (refundStatus == '') {
      return this._httpClient.get(
        `${this.orderBaseUrl}admin-refund/${id}/${refundStatus}`
      );
    } else {
      return this._httpClient.get(`${this.orderBaseUrl}customer-refund/${id}`);
    }
  };

  // approveRefundRequest = (id: string, dto: any): Observable<any> =>
  //   this._httpClient.patch(
  //     `${this.orderBaseUrl}customer-refund/update-refund-request-status/${id}`,
  //     dto
  //   );

  // assignTransporterForCustomerPickUp = (dto: any): Observable<any> =>
  //   this._httpClient.post(
  //     `${this.orderBaseUrl}refund-delivery-assignment`,
  //     dto
  //   );

  // update = (id: string, status: { status: number }): Observable<any> =>
  //   this._httpClient.put(
  //     `${this.orderBaseUrl}admin-refund-delivery-assignment/update/status/${id}`,
  //     status
  //   );
}
