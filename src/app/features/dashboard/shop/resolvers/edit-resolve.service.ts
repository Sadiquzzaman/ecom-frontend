import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {ShopService} from '../shop.service';

@Injectable()
export class EditResolveService implements Resolve<any> {
  constructor(private readonly shopService: ShopService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.shopService.findByID(route.params?.id).pipe(
      map((res: any) => res?.payload?.data || {}),
    );
  }
}
