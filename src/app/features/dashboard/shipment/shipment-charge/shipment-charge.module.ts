import { EditShipmentChargeResolveService } from './resolvers/edit-shipment-charge-resolve.service';
import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { ShipmentChargeRoutingModule } from './shipment-charge-routing.module';
import { ShipmentChargeService } from './shipment-charge.service';
import { ShipmentGroupResolveService } from './resolvers/shipment-group-resolve.service';

@NgModule({
  declarations: [AddComponent, EditComponent, ListComponent],
  imports: [CommonModule, SharedModule, ShipmentChargeRoutingModule],
  providers: [
    ShipmentChargeService,
    ShipmentGroupResolveService,
    EditShipmentChargeResolveService,
  ],
})
export class ShipmentChargeModule {}
