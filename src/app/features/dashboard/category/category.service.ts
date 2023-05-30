import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable()
export class CategoryService {
  baseUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `categories`;
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
    order: string,
    name: string,
    isRoot = ''
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&name=${name}&isRoot=${isRoot}`
    );

  roots = (): Observable<any> => this._httpClient.get(`${this.baseUrl}/roots`);

  trees = (): Observable<any> => this._httpClient.get(`${this.baseUrl}/trees`);

  create = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);

  update = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/${id}`, dto);

  createChild = (parentID: string, dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}/child/${parentID}`, dto);

  updateChild = (id: string, parentID: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/child/${id}/${parentID}`, dto);

  findByID = (id: string | null): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}/${id}`);

  remove = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);

  uploadImageRedis = (image: File): Observable<any> => {
    const formData = new FormData();
    formData.append('image', image);
    return this._httpClient.post(`${this.imageUrl}/category-redis`, formData);
  };

  uploadImage = (filename: string) =>
    this._httpClient.post(`${this.imageUrl}/category`, { filename });
}
