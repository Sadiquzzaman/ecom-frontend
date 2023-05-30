import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable()
export class ReturnService {
  orderBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER);
  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly token: TokenStorageService
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
      return this._httpClient.get(
        `${this.orderBaseUrl}admin-refund-delivery-assignment/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shippingStatus=${shippingStatus}&refundApprovalBool=${refundApprovalBool}&assignStatus=${assignStatus}&customerId=${customerId}&transporterId=${transporterId}&fromDate=${fromDate}&toDate=${toDate}`
      );
    } else {
      return this._httpClient.get(
        `${this.orderBaseUrl}transporter-refund-delivery-assignment/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shippingStatus=${shippingStatus}&refundApprovalBool=${refundApprovalBool}&assignStatus=${assignStatus}&customerId=${customerId}&fromDate=${fromDate}&toDate=${toDate}`
      );
    }
  };

  approvedRefundListPaginationForAdmin = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    isAdmin: boolean = true,
    assignStatus: number
  ): Observable<any> => {
    if (isAdmin) {
      return this._httpClient.get(
        `${this.orderBaseUrl}admin-return-delivery-assignment/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&assignStatus=${assignStatus}`
      );
    } else {
      return this._httpClient.get(
        `${this.orderBaseUrl}merchant-refund/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&assignStatus=${assignStatus}`
      );
    }
  };

  assignedRefundListforMerchant = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    assignStatus: number
  ): Observable<any> => {
    return this._httpClient.get(
      `${this.orderBaseUrl}merchant-refund/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&assignStatus=${assignStatus}`
    );
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

  findByID = (id: string, refundStatus: string): Observable<any> =>
    this._httpClient.get(
      `${this.orderBaseUrl}customer-refund/${id}/${refundStatus}`
    );

  findApprovalDetailsByID = (id: string): Observable<any> =>
    this._httpClient.get(
      `${this.orderBaseUrl}admin-return-delivery-assignment/approvedDetails/${id}`
    );

  approveRefundRequest = (id: string, dto: any): Observable<any> =>
    this._httpClient.patch(
      `${this.orderBaseUrl}customer-refund/update-refund-request-status/${id}`,
      dto
    );

  assignTransporterForCustomerPickUp = (dto: any): Observable<any> =>
    this._httpClient.post(
      `${this.orderBaseUrl}admin-refund-delivery-assignment`,
      dto
    );

  update = (id: string, status: { status: number }): Observable<any> => {
    if (this.token.isTransporter()) {
      return this._httpClient.put(
        `${this.orderBaseUrl}transporter-refund-delivery-assignment/update/status/${id}`,
        status
      );
    } else {
      return this._httpClient.put(
        `${this.orderBaseUrl}admin-refund-delivery-assignment/update/status/${id}`,
        status
      );
    }
  };

  // approverefund = (dto: any): Observable<any> =>
  // this._httpClient.post(`${this.orderBaseUrl}`, dto);

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
