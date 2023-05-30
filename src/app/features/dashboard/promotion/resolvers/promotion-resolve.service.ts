import { PromotionService } from './../promotion.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable()
export class PromotionResolveService implements Resolve<any> {
  constructor(private readonly promotionService: PromotionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.promotionService
      .findByID(route.params?.id)
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
