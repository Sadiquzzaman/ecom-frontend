import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {AddressService} from '../../order/address.service';

@Injectable()
export class ShippingAddressResolveService implements Resolve<any> {
  constructor(private readonly addressService: AddressService) {
  }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): any {
    return this.addressService.getCustomerShippingAddresses().pipe(
      map((res: any) => res?.payload?.data || {}),
    );
  }
}
