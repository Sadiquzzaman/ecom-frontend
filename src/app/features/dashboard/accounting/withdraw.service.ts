import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApiConfigService } from 'src/app/core/services/api-config.service';
import { MicroserviceURL } from 'src/app/core/enum/microservices.enum';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SystemService } from 'src/app/shared/services/system.service';
import { ResponseService } from 'src/app/shared/services/response.service';

@Injectable()
export class WithdrawService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);
  coreBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE);
  orderBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER);
  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);
  imageUrl =
    this.apiConfigService.getUrl(MicroserviceURL.IMAGE) + `image-upload`;

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService,
    private readonly systemService: SystemService
  ) {}

  paymentMethod = {
    0: 'Not Selected',
    1: 'Cash on Delivery',
    2: 'Online Payment',
  };

  availableBalanace = (merchantId: string = ''): Observable<any> => {
    return this._httpClient
      .get(
        `${this.baseUrl}merchant-withdrawal/available-balance?&merchantId=${merchantId}`
      )
      .pipe(map((res: any) => res.payload.data));
  };

  withdrawalPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    isAdmin: boolean = false,
    withdrawalStatus: string,
    merchantID: string,
    fromDate: string,
    toDate: string
  ): Observable<any> => {
    if (isAdmin) {
      return this._httpClient.get(
        `${this.baseUrl}admin-merchant-withdrawal/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&fromDate=${fromDate}&toDate=${toDate}&withdrawalStatus=${withdrawalStatus}&merchantID=${merchantID}`
      );
    }

    return this._httpClient.get(
      `${this.baseUrl}merchant-withdrawal/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&fromDate=${fromDate}&toDate=${toDate}&withdrawalStatus=${withdrawalStatus}`
    );
  };

  merchantSalesFileForAdmin = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    merchantId: string,
    fromDate: string,
    toDate: string,
    fileExtension: string = 'xlsx'
  ) => {
    const fileName: string = 'Merchant Sales History';
    const requestUrl = `${this.baseUrl}admin-invoices/export-merchant?page=${page}&limit=${limit}&sort=${sort}&order=${order}&merchantId=${merchantId}&fromDate=${fromDate}&toDate=${toDate}&fileExtension=${fileExtension}`;
    this.systemService.downloadFile(requestUrl, fileName, fileExtension);
  };

  merchantSalesFileForMerchant = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    merchantId: string,
    fromDate: string,
    toDate: string,
    fileExtension: string = 'xlsx'
  ) => {
    const fileName: string = 'Merchant Sales History';
    const requestUrl = `${this.baseUrl}merchant-invoice/export-merchant?page=${page}&limit=${limit}&sort=${sort}&order=${order}&merchantId=${merchantId}&fromDate=${fromDate}&toDate=${toDate}&fileExtension=${fileExtension}`;
    this.systemService.downloadFile(requestUrl, fileName, fileExtension);
  };

  findMerchantInvoiceByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}merchant-invoice/${id}`);

  findShopInvoiceByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}customer-invoice/${id}`);

  findByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}invoices/${id}`);

  createWithdrawRequest = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}merchant-withdrawal`, dto);

  updateWithdrawRequest = (id: string, dto: any): Observable<any> =>
    this._httpClient.patch(
      `${this.baseUrl}admin-merchant-withdrawal/admin-merchant-withdrawal-update/${id}`,
      dto
    );

  cancelWithdrawRequest = (id: string, dto: any): Observable<any> =>
    this._httpClient.patch(
      `${this.baseUrl}merchant-withdrawal/merchant-withdrawal-update/${id}`,
      dto
    );

  assignTransporter = (dto: any): Observable<any> =>
    this._httpClient.post(
      `${this.orderBaseUrl}admin-shipping/shipment-delivery-assignment`,
      dto
    );

  getAllTransporters = (): Observable<any> => {
    return this._httpClient.get(`${this.userBaseUrl}users/transporter`).pipe(
      map((res: any) => res?.payload?.data || {}),
      tap((res) => console.log(res)),
      map((shops: any[]) =>
        shops.map((data: any) => ({
          id: data?.id,
          firstName: data?.user?.firstName,
          lastName: data?.user?.lastName,
          phone: data?.user?.phone,
          email: data?.user?.email,
        }))
      )
    );
  };

  getMerchantBanks = (): Observable<any> => {
    return this._httpClient
      .get(`${this.coreBaseUrl}banks/merchant`)
      .pipe(map((res: any) => res.payload.data));
  };

  getMerchantAccounts = (): Observable<any> => {
    return this._httpClient
      .get(`${this.userBaseUrl}merchants/bankDetails`)
      .pipe(map((res: any) => res.payload.data));
  };

  getBanks = (): Observable<any> => {
    return this._httpClient
      .get(`${this.coreBaseUrl}banks`)
      .pipe(map((res: any) => res.payload.data));
  };

  uploadImageRedis = (image: File): Observable<any> => {
    const formData = new FormData();
    formData.append('image', image);
    return this._httpClient.post(
      `${this.imageUrl}/withdrawal-document-redis`,
      formData
    );
  };

  uploadImage = (filename: string) =>
    this._httpClient.post(`${this.imageUrl}/withdrawal-document`, { filename });
}
