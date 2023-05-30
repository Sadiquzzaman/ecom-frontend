import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { PromotionListsComponent } from './components/promotion-lists/promotion-lists.component';
import { ApprovedPromotionListComponent } from './components/approved-promotion-list/approved-promotion-list.component';
import { UnapprovedPromotionListComponent } from './components/unapproved-promotion-list/unapproved-promotion-list.component';

import { SlotAddComponent } from './components/slot/slot-add/slot-add.component';
import { SlotEditComponent } from './components/slot/slot-edit/slot-edit.component';
import { SlotListComponent } from './components/slot/slot-list/slot-list.component';

import { MerchantResolveService } from './resolvers/merchant-resolve.service';
import { ProductResolveService } from './resolvers/product-resolve.service';
import { ShopResolveService } from './resolvers/shop-resolve.service';

import { PromotionResolveService } from './resolvers/promotion-resolve.service';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    path: 'slot/add',
    component: SlotAddComponent,
    data: { title: 'Add', permissions: ['admin'] },
    canActivate: [PermissionGuard],
    resolve: {
      merchants: MerchantResolveService,
      shops: ShopResolveService,
      // products: ProductResolveService,
    },
  },
  {
    path: 'slot/list',
    component: SlotListComponent,
    data: { title: 'Promotion List', permissions: ['admin'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'slot/edit/:id',
    component: SlotEditComponent,
    data: { title: 'Edit', permissions: ['admin'] },
    canActivate: [PermissionGuard],
    resolve: {
      promotion: PromotionResolveService,
      // merchants: MerchantResolveService,
      shops: ShopResolveService,
      // products: ProductResolveService,
    },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add', permissions: ['merchant'] },
    canActivate: [PermissionGuard],
    resolve: {
      merchants: MerchantResolveService,
      shops: ShopResolveService,
      products: ProductResolveService,
    },
  },
  {
    path: 'list',
    component: PromotionListsComponent,
    data: { title: 'Promotion List', permissions: ['admin', 'merchant'] },
    canActivate: [PermissionGuard],
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit', permissions: ['admin', 'merchant'] },
    canActivate: [PermissionGuard],
    resolve: {
      promotion: PromotionResolveService,
      // merchants: MerchantResolveService,
      shops: ShopResolveService,
      // products: ProductResolveService,
    },
  },
  // {
  //   path: 'approved-promotion-list',
  //   component: ApprovedPromotionListComponent,
  //   data: { title: 'Approved Promotion List' },
  //   canActivate: [PermissionGuard],
  // },
  // {
  //   path: 'unapproved-promotion-list',
  //   component: UnapprovedPromotionListComponent,
  //   data: { title: 'Unapproved Promotion List' },
  //   canActivate: [PermissionGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionRoutingModule {}
