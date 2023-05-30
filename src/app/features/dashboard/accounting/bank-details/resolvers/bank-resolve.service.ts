import { AccountingService } from './../../accounting.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { ApiConfigService } from 'src/app/core/services/api-config.service';
import { HttpClient } from '@angular/common/http';
import { MicroserviceURL } from 'src/app/core/enum/microservices.enum';

@Injectable()
export class BankResolveService implements Resolve<any> {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + `banks`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly accountingService: AccountingService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._httpClient
      .get(this.baseUrl)
      .pipe(map((res: any) => res?.payload?.data || []));
  }
}
