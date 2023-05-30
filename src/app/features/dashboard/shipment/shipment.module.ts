import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentRoutingModule } from './shipment-routing.module';
import { ShipmentService } from './shipment.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, ShipmentRoutingModule, SharedModule],
  providers: [ShipmentService],
})
export class ShipmentModule {}
