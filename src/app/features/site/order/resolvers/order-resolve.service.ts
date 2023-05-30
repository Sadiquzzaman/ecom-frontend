import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {OrderService} from '../order.service';

@Injectable()
export class OrderResolveService implements Resolve<any> {
  constructor(private readonly orderService: OrderService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.orderService.getByID(route.params?.id).pipe(
      map((res: any) => res?.payload?.data || {}),
    );
  }
}
