import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigurationService {
  baseUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CORE) + `configurations`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  createConfiguration = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  remove = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);

  findByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}/${id}`);

  update = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/${id}`, dto);
}
