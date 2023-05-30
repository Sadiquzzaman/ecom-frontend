import { OrderService } from './../order.service';
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

@Injectable()
export class OrderResolveService implements Resolve<any> {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + `orders`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly orderService: OrderService
  ) {}

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): any {
    return this.orderService
      .findByID(_route.params.orderId)
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
