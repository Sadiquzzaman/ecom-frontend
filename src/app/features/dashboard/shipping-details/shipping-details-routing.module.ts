import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';
import { AssignedOrderListComponent } from './components/assigned-order-list/assigned-order-list.component';
import { UnassignedOrderListComponent } from './components/unassigned-order-list/unassigned-order-list.component';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'assigned-order-list',
    component: AssignedOrderListComponent,
    data: {
      title: 'Assigned-Order-list',
      permissions: ['admin', 'merchant', 'shop-manager'],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'unassigned-order-list',
    component: UnassignedOrderListComponent,
    data: {
      title: 'Unsssigned-Order-list',
      permissions: ['admin', 'merchant', 'shop-manager'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingDetailsRoutingModule {}
