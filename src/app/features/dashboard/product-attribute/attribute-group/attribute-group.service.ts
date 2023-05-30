import { ApiConfigService } from '../../../../core/services/api-config.service';
import { MicroserviceURL } from 'src/app/core/enum/microservices.enum';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AttributeGroupService {
  baseUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `attribute-groups`;

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

  createAttributeGroups = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);

  findByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}/${id}`);

  getAll = (): Observable<any> => this._httpClient.get(`${this.baseUrl}`);

  remove = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);

  update = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/${id}`, dto);
}
