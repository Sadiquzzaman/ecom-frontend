import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot,} from '@angular/router';
import {map} from 'rxjs/operators';
import {ShopTypeService} from '../shop-type.service';

@Injectable()
export class EditResolveService implements Resolve<any> {
  constructor(private readonly shopTypeService: ShopTypeService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.shopTypeService
      .findByID(route.params?.id)
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
