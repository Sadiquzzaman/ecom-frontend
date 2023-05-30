import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot,} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from '../../../../core/services/api-config.service';
import {MicroserviceURL} from '../../../../core/enum/microservices.enum';
import {of} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PromotionResolveService implements Resolve<any> {
  promotionUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + 'promotions';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this._httpClient
      .get(`${this.promotionUrl}/latest-promotions`)
      .pipe(map((res: any) => res?.payload?.data || {}));
    return of({})
  }
}
