import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddUserComponent } from './add-user/add-user.component';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: AddUserComponent,
    data: { title: 'Add Admin', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'transporter',
    component: AddUserComponent,
    data: { title: 'Add Transporter', permissions: ['admin', 'shop-manager'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'shop-manager',
    component: AddUserComponent,
    data: { title: 'Add Shop Manager', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUserRoutingModule {}
