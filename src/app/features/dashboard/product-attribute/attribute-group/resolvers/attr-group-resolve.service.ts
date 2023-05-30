import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { map } from 'rxjs/operators';
import { AttributeGroupService } from '../attribute-group.service';

@Injectable()
export class AttrGroupResolveService implements Resolve<any> {

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private attributeGroupService: AttributeGroupService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.attributeGroupService
      .getAll()
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
