import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingDetailsRoutingModule } from './shipping-details-routing.module';
import { ShippingDetailsService } from './shipping-details.service';
import { TransporterDialogComponent } from './components/transporter-dialog/transporter-dialog.component';
import { AssignedOrderListComponent } from './components/assigned-order-list/assigned-order-list.component';
import { UnassignedOrderListComponent } from './components/unassigned-order-list/unassigned-order-list.component';

@NgModule({
  declarations: [
    TransporterDialogComponent,
    AssignedOrderListComponent,
    UnassignedOrderListComponent,
  ],
  imports: [CommonModule, ShippingDetailsRoutingModule, SharedModule],
  providers: [ShippingDetailsService],
})
export class ShippingDetailsModule {}
