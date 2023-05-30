import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { AttributeService } from '../attribute.service';

@Injectable()
export class EditAttributeResolveService implements Resolve<any> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private attributeService: AttributeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.attributeService
      .findByID(route.params?.id)
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
