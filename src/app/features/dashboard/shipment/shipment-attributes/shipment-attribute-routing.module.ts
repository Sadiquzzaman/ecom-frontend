import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { EditShipmentAttributeResolveService } from './resolvers/edit-shipment-attribute-resolve.service';

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'All Shipment Attributes' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add Shipment Attributes' },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit Shipment Attributes' },
    resolve: { shipmentAttr: EditShipmentAttributeResolveService },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipmrntAtrributeRoutingModule {}
