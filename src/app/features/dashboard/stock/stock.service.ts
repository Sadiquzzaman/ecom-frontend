import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG);

  constructor(
    private apiConfigService: ApiConfigService,
    private readonly _httpClient: HttpClient
  ) {}

  getStockInfo = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    isAdmin: boolean,
    name: string = '',
    categoryId: string = '',
    shopId: string = '',
    merchantId: string = '',
    isApproved: string = ''
  ): Observable<any> => {
    if (isAdmin) {
      return this._httpClient.get(
        `${this.baseUrl}admin/products/stock?page=${page}&limit=${limit}&sort=${sort}&order=${order}&name=${name}&categoryId=${categoryId}&shopId=${shopId}&merchantId=${merchantId}&isApproved=${isApproved}`
      );
    } else {
      return this._httpClient.get(
        `${this.baseUrl}merchant/products/stock?page=${page}&limit=${limit}&sort=${sort}&order=${order}&name=${name}&categoryId=${categoryId}&shopId=${shopId}&isApproved=${isApproved}`
      );
    }
  };
}
