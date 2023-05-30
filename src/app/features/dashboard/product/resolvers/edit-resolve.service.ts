import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {ProductService} from '../product.service';

@Injectable()
export class EditResolveService implements Resolve<any> {
  constructor(private readonly productService: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.productService.findByID(route.params?.id).pipe(
      map((res: any) => res?.payload?.data || {}),
    );
  }
}
