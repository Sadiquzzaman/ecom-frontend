import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundRequestComponent } from './components/refund-request/refund-request.component';
import { RefundRoutingRoutingModule } from './refund-routing.module';
import { RefundRequestDetailsComponent } from './components/refund-request-details/refund-request-details.component';
import { UnassignedRefundRequestsComponent } from './components/unassigned-refund-requests/unassigned-refund-requests.component';
import { RejectedRefundRequestComponent } from './components/rejected-refund-request/rejected-refund-request.component';
@NgModule({
  declarations: [
    RefundRequestComponent,
    RefundRequestDetailsComponent,
    UnassignedRefundRequestsComponent,
    RejectedRefundRequestComponent,
  ],
  imports: [CommonModule, SharedModule, RefundRoutingRoutingModule],
})
export class RefundModule {}
