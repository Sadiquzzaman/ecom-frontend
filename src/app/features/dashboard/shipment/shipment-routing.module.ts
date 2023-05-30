import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'attribute',
    loadChildren: () =>
      import('./shipment-attributes/shipment-attributes.module').then(
        (m) => m.ShipmentAttributesModule
      ),
  },
  {
    path: 'charge',
    loadChildren: () =>
      import('./shipment-charge/shipment-charge.module').then(
        (m) => m.ShipmentChargeModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipmentRoutingModule {}
