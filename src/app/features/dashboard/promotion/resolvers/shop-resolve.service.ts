import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../../core/enum/microservices.enum';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { of } from 'rxjs';

@Injectable()
export class ShopResolveService implements Resolve<any> {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + 'shops';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private token: TokenStorageService,
    private apiConfigService: ApiConfigService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (this.token.isMerchant()) {
      this.baseUrl =
        this.apiConfigService.getUrl(MicroserviceURL.CATELOG) +
        'shops/find/user/' +
        this.token.getUserId() +
        '/type';

      return this._httpClient.get(`${this.baseUrl}`).pipe(
        map((res: any) => res?.payload?.data || {}),
        map((shops: any[]) =>
          shops.map((shop: any) => ({
            id: shop.id,
            name: shop.name,
            // typeId: shop.shopType?.id,
            // type: shop.shopType?.name,
          }))
        )
      );
    }
    return of([]);
  }
}
