import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable()
export class ShipmentService {
  baseUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `promotions`;
  imageUrl =
    this.apiConfigService.getUrl(MicroserviceURL.IMAGE) + `image-upload`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  create = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);

  update = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/${id}`, dto);

  uploadCoverImage = (filename: string, type: number) =>
    this._httpClient.post(`${this.imageUrl}/promotion/cover`, {
      filename,
      type,
    });

  uploadCoverImageRedis = (image: File): Observable<any> => {
    const formData = new FormData();
    formData.append('image', image);
    return this._httpClient.post(
      `${this.imageUrl}/promotion-redis/cover`,
      formData
    );
  };

  remove = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);
}
