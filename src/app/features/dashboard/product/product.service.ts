import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable()
export class ProductService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `products`;
  mainBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG);
  adminBaseUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `admin/products`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly token: TokenStorageService
  ) {}

  approvalPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    approvalLabel: number
  ): Observable<any> => {
    if (this.token.isAdmin()) {
      return this._httpClient.get(
        `${this.mainBaseUrl}admin/products/approval-pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&approvalLabel=${approvalLabel}`
      );
    } else {
      return this._httpClient.get(
        `${this.baseUrl}/approval-pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&approvalLabel=${approvalLabel}`
      );
    }
  };

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    isAdmin: boolean,
    shopId: string = '',
    productName: string = '',
    productCategoryId: string = ''
  ): Observable<any> => {
    if (isAdmin) {
      return this._httpClient.get(
        `${this.mainBaseUrl}admin/products/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&name=${productName}&categoryId=${productCategoryId}&shopId=${shopId}`
      );
    } else {
      return this._httpClient.get(
        `${this.mainBaseUrl}merchant/products/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&name=${productName}&categoryId=${productCategoryId}&shopId=${shopId}`
      );
    }
  };

  findByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}/${id}`);

  adminProductCcreate = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.mainBaseUrl}admin/products`, dto);

  merchnatProductCcreate = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.mainBaseUrl}merchant/products`, dto);

  update = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/${id}`, dto);

  // updateStatusToTrue = (dto: any): Observable<any> =>
  //   this._httpClient.put(`${this.baseUrl}/product-approval`, dto);

  // updateStatusToFalse = (dto: any): Observable<any> =>
  //   this._httpClient.put(`${this.baseUrl}/product-approval`, dto);

  updateApprovalStatus = (dto: any): Observable<any> =>
    this._httpClient.put(
      `${this.mainBaseUrl}admin/products/product-approval`,
      dto
    );

  remove = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.adminBaseUrl}/${id}`);
}
