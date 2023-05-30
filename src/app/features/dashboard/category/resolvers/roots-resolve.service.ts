import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {CategoryService} from '../category.service';

@Injectable()
export class RootsResolveService implements Resolve<any> {
  constructor(private readonly categoryService: CategoryService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.categoryService.roots().pipe(
      map((res: any) => res?.payload?.data || {}),
    );
  }
}
