import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import { ConfigurationService } from '../configuration.service';

@Injectable()
export class EditResolveService implements Resolve<any> {
  constructor(private readonly configurationService: ConfigurationService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.configurationService.findByID(route.params?.id).pipe(
      map((res: any) => res?.payload?.data || {}),
    );
  }
}
