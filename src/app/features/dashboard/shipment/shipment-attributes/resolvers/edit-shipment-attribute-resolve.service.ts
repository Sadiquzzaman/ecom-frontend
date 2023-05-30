import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { ShipmentAttributeService } from '../shipment-attribute.service';

@Injectable()
export class EditShipmentAttributeResolveService implements Resolve<any> {
  constructor(
    private readonly shipmentAttributeService: ShipmentAttributeService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.shipmentAttributeService
      .findByID(route.params?.id)
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
