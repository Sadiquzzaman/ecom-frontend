import { UnassignedRefundRequestsComponent } from './components/unassigned-refund-requests/unassigned-refund-requests.component';
import { RefundService } from './refund.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefundRequestComponent } from './components/refund-request/refund-request.component';
import { RefundRequestDetailsComponent } from './components/refund-request-details/refund-request-details.component';
import { RejectedRefundRequestComponent } from './components/rejected-refund-request/rejected-refund-request.component';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'refund-request-list',
    component: RefundRequestComponent,
    data: { title: 'Refund Request List', permissions: ['admin', 'customer'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'refund-request/details/:id',
    component: RefundRequestDetailsComponent,
    data: {
      title: 'Refund Request Details',
      permissions: ['admin', 'customer'],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'unassigned-refund-requests',
    component: UnassignedRefundRequestsComponent,
    data: { title: 'unassigned-refund-requests', permissions: ['admin'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'rejected-refund-requests',
    component: RejectedRefundRequestComponent,
    data: { title: 'rejected-refund-requests', permissions: ['admin'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [RefundService],
})
export class RefundRoutingRoutingModule {}
