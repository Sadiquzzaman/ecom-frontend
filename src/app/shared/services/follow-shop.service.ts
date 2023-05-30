import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from '../../core/enum/microservices.enum';
import { ApiConfigService } from '../../core/services/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class FollowShopService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `shops`;

  constructor(
    private _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {
  }

  followShop = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}/follow`, dto);


  unFollowShop = (id: string): Observable<any> => this._httpClient.delete(`${this.baseUrl}/${id}/unfollow`);


}
