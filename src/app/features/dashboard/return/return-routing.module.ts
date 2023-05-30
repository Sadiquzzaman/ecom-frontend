import { ReturnService } from './return.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnassignedReturnListComponent } from './components/unassigned-return-list/unassigned-return-list.component';
import { DeliveredReturnListComponent } from './components/delivered-return-list/delivered-return-list.component';
import { AssignedReturnListComponent } from './components/assigned-return-list/assigned-return-list.component';
import { PickedReturnListComponent } from './components/picked-return-list/picked-return-list.component';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'unassigned-return-list',
    component: UnassignedReturnListComponent,
    data: {
      title: 'Unassigned Return List',
      permissions: ['admin', 'merchant'],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'delivered-return-list',
    component: DeliveredReturnListComponent,
    data: {
      title: 'Delivered Return List',
      permissions: ['admin', 'transporter'],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'picked-return-list',
    component: PickedReturnListComponent,
    data: {
      title: 'Picked Return List',
      permissions: ['admin', 'transporter'],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'assigned-return-list',
    component: AssignedReturnListComponent,
    data: {
      title: 'Assigned Return List',
      permissions: ['admin', 'merchant', 'transporter'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ReturnService],
})
export class ReturnRoutingRoutingModule {}
