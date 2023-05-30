import { AdminListComponent } from './components/admin-list/admin-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { MerchantListComponent } from './components/merchant-list/merchant-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ProfileEditComponent } from './components/user-profile/components/edit/profile-edit.component';
import { UserProfileComponent } from './components/user-profile/components/user-profile/user-profile.component';
import { EditProfileResolveService } from './components/user-profile/resolver/edit-profile-resolve.service';
import { MerchantApprovedListComponent } from './components/merchant-approved-list/merchant-approved-list.component';
import { MerchantUnapprovedListComponent } from './components/merchant-unapproved-list/merchant-unapproved-list.component';
import { TransporterListComponent } from './components/transporter-list/transporter-list.component';
import { ShopManagerListComponent } from './components/shop-manager-list/shop-manager-list.component';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  { path: ':id/edit', component: EditComponent, data: { title: 'Edit' } },
  {
    path: ':id/add-role',
    component: AddComponent,
    data: { title: 'Add Role', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'edit/profile',
    component: ProfileEditComponent,
    data: { title: 'Profile Edit' },
    resolve: {
      user: EditProfileResolveService,
    },
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    data: { title: 'Profile' },
  },
  {
    path: 'merchant-list',
    component: MerchantListComponent,
    data: { title: 'Merchant', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'merchant-approved-list',
    component: MerchantApprovedListComponent,
    data: { title: 'Approved Merchant List', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'merchant-unapproved-list',
    component: MerchantUnapprovedListComponent,
    data: { title: 'Unapproved Merchant List', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'customer-list',
    component: CustomerListComponent,
    data: { title: 'Customer', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'transporter-list',
    component: TransporterListComponent,
    data: { title: 'Transporter List', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'admin-list',
    component: AdminListComponent,
    data: { title: 'Admin', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'shop-manager-list',
    component: ShopManagerListComponent,
    data: { title: 'Shop Manager List', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
