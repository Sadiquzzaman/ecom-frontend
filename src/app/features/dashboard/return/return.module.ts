import { RefundModule } from './../refund/refund.module';
import { ReturnService } from './return.service';
import { ReturnRoutingRoutingModule } from './return-routing.module';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnassignedReturnListComponent } from './components/unassigned-return-list/unassigned-return-list.component';
import { AssignedReturnListComponent } from './components/assigned-return-list/assigned-return-list.component';
import { DeliveredReturnListComponent } from './components/delivered-return-list/delivered-return-list.component';
import { ApprovalDetailsComponent } from './components/approval-details/approval-details.component';
import { PickedReturnListComponent } from './components/picked-return-list/picked-return-list.component';

@NgModule({
  declarations: [
    UnassignedReturnListComponent,
    AssignedReturnListComponent,
    DeliveredReturnListComponent,
    ApprovalDetailsComponent,
    PickedReturnListComponent,
  ],
  imports: [CommonModule, SharedModule, ReturnRoutingRoutingModule],
  providers: [ReturnService],
})
export class ReturnModule {}
