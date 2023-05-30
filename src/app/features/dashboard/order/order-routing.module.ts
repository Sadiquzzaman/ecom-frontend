import { ReturnComponent } from './components/return/return.component';
import { StatusHistoryComponent } from './components/status-history/status-history.component';
import { HistoryComponent } from './components/history/history.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { OrderResolveService } from './resolvers/order-resolve.service';
import { DeliveryHistoryComponent } from './components/delivery-history/delivery-history.component';
import { SameUrlNavigationResolver } from 'src/app/shared/resolver/same-url-navigation-resolver';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: '',
    component: HistoryComponent,
    data: { title: 'Order History', permissions: ['admin', 'customer'] },
    resolve: { sameUrlNavigation: SameUrlNavigationResolver },
    runGuardsAndResolvers: 'always',
  },
  {
    canActivate: [PermissionGuard],
    path: 'details/:orderId',
    component: StatusHistoryComponent,
    data: {
      title: 'Order details History',
      permissions: ['admin', 'customer', 'shop-manager'],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'invoice/:invoiceId',
    component: InvoiceComponent,
    data: {
      title: 'Order Invoice',
      permissions: ['admin', 'customer', 'shop-manager'],
    },
    // resolve: {
    //   invoice: OrderResolveService,
    // },
  },
  {
    canActivate: [PermissionGuard],
    path: 'return/:orderId',
    component: ReturnComponent,
    data: { title: 'Return', permissions: ['customer'] },
    // resolve: {
    //   order: OrderResolveService,
    // },
  },
  {
    canActivate: [PermissionGuard],
    path: 'delivery-history/:orderId',
    component: DeliveryHistoryComponent,
    data: {
      title: 'Order Delivery History',
      permissions: ['admin', 'customer', 'shop-manager'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
