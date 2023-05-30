import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { ShipmrntAtrributeRoutingModule } from './shipment-attribute-routing.module';
import { ShipmentAttributeService } from './shipment-attribute.service';
import { EditShipmentAttributeResolveService } from './resolvers/edit-shipment-attribute-resolve.service';

@NgModule({
  declarations: [AddComponent, EditComponent, ListComponent],
  imports: [CommonModule, ShipmrntAtrributeRoutingModule, SharedModule],
  providers: [ShipmentAttributeService, EditShipmentAttributeResolveService],
})
export class ShipmentAttributesModule {}
