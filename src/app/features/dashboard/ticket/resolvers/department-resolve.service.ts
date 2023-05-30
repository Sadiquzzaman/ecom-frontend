import { ApiConfigService } from '../../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../../core/enum/microservices.enum';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable()
export class DepartmentResolveService implements Resolve<any> {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + `department`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly token: TokenStorageService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._httpClient
      .get(this.baseUrl)
      .pipe(map((res: any) => res?.payload?.data || []));
  }
}
