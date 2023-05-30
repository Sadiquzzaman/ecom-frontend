import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable()
export class ShopService {
  mainBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG);
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `shops`;
  imageUrl =
    this.apiConfigService.getUrl(MicroserviceURL.IMAGE) + `image-upload`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  approvalPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    is_approved: number
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/shop-by-approval-status?page=${page}&limit=${limit}&sort=${sort}&order=${order}&is_approved=${is_approved}`
    );

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    isAdmin:boolean,
    shopName: string = '',
    merchantId: string = '',
    shopTypeId: string = ''
  ): Observable<any> => {
    if (isAdmin) {
      return this._httpClient.get(
        `${this.mainBaseUrl}admin/shops/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&name=${shopName}&merchantId=${merchantId}&shopTypeId=${shopTypeId}`
      );
    } else {
      return this._httpClient.get(
        `${this.mainBaseUrl}merchant/shops/merchant-shops-pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&name=${shopName}&shopTypeId=${shopTypeId}`
      );
    }
  }

  findByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}/${id}`);

  create = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);

  update = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/${id}`, dto);

  remove = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);

  uploadCoverImage = (filename: string) => {
    return this._httpClient.post(`${this.imageUrl}/shop/cover`, { filename });
  };

  uploadCoverImageRedis = (image: File): Observable<any> => {
    const formData = new FormData();
    formData.append('image', image);
    return this._httpClient.post(`${this.imageUrl}/shop-redis/cover`, formData);
  };

  uploadProfileImage = (filename: string) =>
    this._httpClient.post(`${this.imageUrl}/shop/profile`, { filename });

  uploadProfileImageRedis = (image: File): Observable<any> => {
    const formData = new FormData();
    formData.append('image', image);
    return this._httpClient.post(
      `${this.imageUrl}/shop-redis/profile`,
      formData
    );
  };

  updateApprovalStatus = (dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/shop-approval`, dto);
}
