import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from 'src/app/core/enum/microservices.enum';
import { ApiConfigService } from 'src/app/core/services/api-config.service';
import { SystemService } from 'src/app/shared/services/system.service';

@Injectable()
export class AccountingService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);
  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);
  coreBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE);

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

  bankListForAdmin = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.coreBaseUrl}banks/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  adminMerchantInvpagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    merchantId: string,
    fromDate: string,
    toDate: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}admin-invoices/pagination-merchant?page=${page}&limit=${limit}&sort=${sort}&order=${order}&merchantId=${merchantId}&fromDate=${fromDate}&toDate=${toDate}`
    );

  merchantInvoicePagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    merchantId: string,
    fromDate: string,
    toDate: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}merchant-invoice/pagination-merchant?page=${page}&limit=${limit}&sort=${sort}&order=${order}&merchantId=${merchantId}&fromDate=${fromDate}&toDate=${toDate}`
    );

  adminInvPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    customerId: string,
    fromDate: string,
    toDate: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}admin-invoices/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&customerId=${customerId}&fromDate=${fromDate}&toDate=${toDate}`
    );

  adminShopInvPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    shopId: string,
    fromDate: string,
    toDate: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}admin-invoices/pagination-shop?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shopId=${shopId}&fromDate=${fromDate}&toDate=${toDate}`
    );

  merchantShopInvoicePagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    shopId: string,
    fromDate: string,
    toDate: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}merchant-invoice/pagination-shop?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shopId=${shopId}&fromDate=${fromDate}&toDate=${toDate}`
    );

  findMerchantInvoiceByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}merchant-invoice/${id}`);

  findShopInvoiceByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}customer-invoice/${id}`);

  findByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}invoices/${id}`);

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

  adminSalesFileForAdmin = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    customerId: string,
    fromDate: string,
    toDate: string,
    fileExtension: string = 'xlsx'
  ) => {
    const fileName: string = 'Admin Sales History';
    const requestUrl = `${this.baseUrl}admin-invoices/export-admin?page=${page}&limit=${limit}&sort=${sort}&order=${order}&customerId=${customerId}&fromDate=${fromDate}&toDate=${toDate}&fileExtension=${fileExtension}`;
    this.systemService.downloadFile(requestUrl, fileName, fileExtension);
  };

  shopSalesFileForAdmin = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    shopId: string,
    fromDate: string,
    toDate: string,
    fileExtension: string = 'xlsx'
  ) => {
    const fileName: string = 'Shop Sales History';
    const requestUrl = `${this.baseUrl}admin-invoices/export-shop?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shopId=${shopId}&fromDate=${fromDate}&toDate=${toDate}&fileExtension=${fileExtension}`;
    this.systemService.downloadFile(requestUrl, fileName, fileExtension);
  };

  shopSalesFileForMerchant = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    shopId: string,
    fromDate: string,
    toDate: string,
    fileExtension: string = 'xlsx'
  ) => {
    const fileName: string = 'Shop Sales History';
    const requestUrl = `${this.baseUrl}merchant-invoice/export-merchant-shop?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shopId=${shopId}&fromDate=${fromDate}&toDate=${toDate}&fileExtension=${fileExtension}`;
    this.systemService.downloadFile(requestUrl, fileName, fileExtension);
  };

  addBankDetails = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.userBaseUrl}merchants/bankDetails`, dto);

  bankDetailsPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    isAdmin: boolean = false,
    bankId: string,
    accountNumber: string,
    accountHolderName: string,
    merchantId: string
  ): Observable<any> => {
    if (isAdmin) {
      return this._httpClient.get(
        `${this.userBaseUrl}users/bankDetails/pagination?page=${page}&limit=${limit}&sort=${sort}&bankId=${bankId}&accountNumber=${accountNumber}&accountHolderName=${accountHolderName}&order=${order}&merchantId=${merchantId}`
      );
    } else {
      return this._httpClient.get(
        `${this.userBaseUrl}merchants/bankDetails/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&bankId=${bankId}&accountNumber=${accountNumber}&accountHolderName=${accountHolderName}&order=${order}`
      );
    }
  };

  removeBankDetail = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.userBaseUrl}merchants/bankDetails/${id}`);

  updateBankDetail = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.userBaseUrl}merchants/bankDetails/${id}`, dto);

  findBankDetailByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.userBaseUrl}merchants/bankDetails/${id}`);
}
