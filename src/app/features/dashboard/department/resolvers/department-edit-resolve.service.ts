import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { DepartmentService } from '../department.service';

@Injectable()
export class DepartmentEditResolveService implements Resolve<any> {
  constructor(private readonly departmentService: DepartmentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.departmentService
      .findByID(route.params?.id)
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
