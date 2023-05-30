import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable()
export class ProductAttributeService {
  baseUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) +
    `product-attributes`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  bulkCreate = (dtos: any[]): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}/create/bulk`, dtos);

  updateProductAttribute = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/${id}`, dto);
}
