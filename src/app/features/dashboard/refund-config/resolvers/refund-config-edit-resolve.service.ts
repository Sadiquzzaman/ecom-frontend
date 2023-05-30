import { RefundConfigService } from './../refund-config.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable()
export class RefundConfigEditResolveService implements Resolve<any> {
  constructor(private readonly refundConfigService: RefundConfigService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.refundConfigService
      .findByID(route.params?.id)
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
