import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../../core/enum/microservices.enum';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { Observable } from 'rxjs';

@Injectable()
export class ShopManagerResolveService implements Resolve<any> {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'users';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly token: TokenStorageService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let page = 1;
    let limit = 100;
    let sort = 'firstName';
    let order = 'ASC';
    let label = 'SHOP_MANAGER';

    let url = `${this.baseUrl}/admin-pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&label=${label}`;

    return this._httpClient.get(url).pipe(
      map((res: any) => res?.page?.data || {}),
      tap((res) => console.log(res)),
      map((users: any[]) =>
        users.map((data: any) => ({
          // console.log(data);
          id: data.shopManager?.id,
          name: data.firstName + ' ' + data.lastName + ' ' + data.phone,
        }))
      )
    );
  }
}
