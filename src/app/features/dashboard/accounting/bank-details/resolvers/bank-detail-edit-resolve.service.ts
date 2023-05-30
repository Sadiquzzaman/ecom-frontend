import { AccountingService } from './../../accounting.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable()
export class BankDetailResolveService implements Resolve<any> {
  constructor(private readonly accountingService: AccountingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.accountingService
      .findBankDetailByID(route.params?.id)
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
