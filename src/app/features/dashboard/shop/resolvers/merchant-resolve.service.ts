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

@Injectable()
export class MerchantResolveService implements Resolve<any> {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'merchants';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly token: TokenStorageService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let url = `${this.baseUrl}`;
    if (this.token.isMerchant()) {
      url = `${this.baseUrl}/${this.token.getUserId()}`;
      return this._httpClient.get(url).pipe(
        map((res: any) => res?.payload?.data || {}),
        map((user: any) => ({
          id: user.merchant?.id,
          name: user.firstName + ' ' + user.lastName + '' + user.phone,
        }))
      );
    }
    return this._httpClient.get(url).pipe(
      map((res: any) => res?.payload?.data || {}),
      map((users: any[]) =>
        users.map((data: any) => ({
          id: data.merchant?.id,
          name: data.firstName + ' ' + data.lastName + ' ' + data.phone,
        }))
      )
    );
  }
}
