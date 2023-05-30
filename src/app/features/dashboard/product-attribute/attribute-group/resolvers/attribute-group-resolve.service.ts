import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { AttributeGroupService } from '../attribute-group.service';

@Injectable()
export class AttributeGroupResolveService implements Resolve<any> {
  constructor(private readonly attributeGroupService: AttributeGroupService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.attributeGroupService
      .findByID(route.params?.id)
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
