import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ShipmentGroupResolveService } from './resolvers/shipment-group-resolve.service';
import { EditShipmentChargeResolveService } from './resolvers/edit-shipment-charge-resolve.service';

const routes: Routes = [
  {
    path: 'list/details/:id',
    component: ListComponent,
    data: { title: 'All Shipment Charge' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add Shipment Charge' },
    resolve: {
      shipmentGroup: ShipmentGroupResolveService,
    },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit Shipment Charge' },
    resolve: {
      editCharge: EditShipmentChargeResolveService,
      shipmentGroup: ShipmentGroupResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipmentChargeRoutingModule {}
