import { ReceivedRefundListComponent } from './components/received-refund-list/received-refund-list.component';
import { RefundInvoiceComponent } from './components/refund-invoice/refund-invoice.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignedRefundListComponent } from './components/assigned-refund-list/assigned-refund-list.component';
import { PickedRefundListComponent } from './components/picked-refund-list/picked-refund-list.component';
import { ReceivedRefundDetailsComponent } from './components/received-refund-details/received-refund-details.component';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'assigned-refund-list',
    component: AssignedRefundListComponent,
    data: { title: 'Assigned-list', permissions: ['admin', 'transporter'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'picked-refund-list',
    component: PickedRefundListComponent,
    data: { title: 'Picked-list', permissions: ['admin', 'transporter'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'received-refund-list',
    component: ReceivedRefundListComponent,
    data: { title: 'Received-list', permissions: ['admin', 'transporter'] },
  },

  {
    canActivate: [PermissionGuard],
    path: 'refund-inoice/details/:id',
    component: RefundInvoiceComponent,
    data: {
      title: 'Refund Details',
      permissions: [
        'admin',
        // 'merchant',
        // 'customer',
        // 'transporter',
        // 'shop-manager',
      ],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'refund-request/details/:id',
    component: ReceivedRefundDetailsComponent,
    data: {
      title: 'Refund Request Details',
      permissions: [
        'admin',
        // 'merchant',
        // 'customer',
        // 'transporter',
        // 'shop-manager',
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransporterRefundRoutingModule {}
