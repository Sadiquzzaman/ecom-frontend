import { TransporterRefundRoutingModule } from './transporter-refund-routing.module';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AssignedRefundListComponent } from './components/assigned-refund-list/assigned-refund-list.component';
import { PickedRefundListComponent } from './components/picked-refund-list/picked-refund-list.component';
import { TransporterRefundService } from './transporter-refund.service';
import { RefundInvoiceComponent } from './components/refund-invoice/refund-invoice.component';
import { ReceivedRefundListComponent } from './components/received-refund-list/received-refund-list.component';
import { ReceivedRefundDetailsComponent } from './components/received-refund-details/received-refund-details.component';
import { RefundService } from '../refund/refund.service';

@NgModule({
  declarations: [
    AssignedRefundListComponent,
    PickedRefundListComponent,
    RefundInvoiceComponent,
    ReceivedRefundListComponent,
    ReceivedRefundDetailsComponent,
  ],
  imports: [CommonModule, SharedModule, TransporterRefundRoutingModule],
  providers: [TransporterRefundService, RefundService, DatePipe],
})
export class TransporterRefundModule {}
