import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from '../../core/enum/microservices.enum';
import { ApiConfigService } from '../../core/services/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `products`;

  constructor(
    private _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  productWishlist = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}/wishlist`, dto);

  removeWishlist = (id: string): Observable<any> => {
    return this._httpClient.delete(`${this.baseUrl}/${id}/removewishlist`);
  };
}
