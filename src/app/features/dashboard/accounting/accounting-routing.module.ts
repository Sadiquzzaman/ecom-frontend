import { BankDetailResolveService } from './bank-details/resolvers/bank-detail-edit-resolve.service';
import { MerchantSalesComponent } from './sales-history/merchant-sales/merchant-sales.component';
import { AdminSalesComponent } from './sales-history/admin-sales/admin-sales.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MerchantInvoicesComponent } from './sales-history/invoices/merchant-invoices/merchant-invoices.component';
import { ShopSalesComponent } from './sales-history/shop-sales/shop-sales.component';
import { ShopInvoicesComponent } from './sales-history/invoices/shop-invoices/shop-invoices.component';
import { MerchantWithdrawalsComponent } from './withdraw-history/merchant-withdrawals/merchant-withdrawals.component';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';
import { AddComponent } from './bank-details/add/add.component';
import { EditComponent } from './bank-details/edit/edit.component';
import { ListComponent } from './bank-details/list/list.component';
import { BankResolveService } from './bank-details/resolvers/bank-resolve.service';
import { BankListComponent } from './bank-details/bank-list/bank-list.component';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'admin-sales-history',
    component: AdminSalesComponent,
    data: {
      title: 'Admin Sales',
      permissions: ['admin'],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'merchant-sales-history',
    component: MerchantSalesComponent,
    data: {
      title: 'Merchant Sales',
      permissions: [
        'admin',
        'merchant',
        // 'shop-manager',
      ],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'merchant-invoices/details/:invoiceId',
    component: MerchantInvoicesComponent,
    data: {
      title: 'Merchant Invoices',
      permissions: [
        'admin',
        'merchant',
        // 'shop-manager',
      ],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'shop-sales-history',
    component: ShopSalesComponent,
    data: {
      title: 'Shop Sales',
      permissions: ['admin', 'merchant', 'shop-manager'],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'shop-invoices/details/:id',
    component: ShopInvoicesComponent,
    data: {
      title: 'Merchant Invoices',
      permissions: ['admin', 'merchant', 'shop-manager'],
    },
  },
  {
    path: 'merchant-withdrawals',
    component: MerchantWithdrawalsComponent,
    data: { title: 'Merchant Withdrawals', permissions: ['merchant'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'admin-merchant-withdrawals',
    component: MerchantWithdrawalsComponent,
    data: { title: 'All Merchant Withdrawals', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },

  {
    path: 'bank-details/add',
    component: AddComponent,
    data: { title: 'Merchant Withdrawals', permissions: ['merchant'] },
    canActivate: [PermissionGuard],
    resolve: { banks: BankResolveService },
  },
  {
    path: 'bank-details/edit/:id',
    component: EditComponent,
    data: { title: 'Merchant Withdrawals', permissions: ['merchant'] },
    canActivate: [PermissionGuard],
    resolve: {
      bankDetail: BankDetailResolveService,
      banks: BankResolveService,
    },
  },
  {
    path: 'bank-details/list',
    component: ListComponent,
    data: { title: 'Merchant Withdrawals', permissions: ['merchant', 'admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'bank/list',
    component: BankListComponent,
    data: { title: 'Bank Lists', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingRoutingModule {}
