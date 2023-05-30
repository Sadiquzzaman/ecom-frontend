import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { AddComponent } from './components/add/add.component';
import { MerchantResolveService } from './resolvers/merchant-resolve.service';
import { EditResolveService } from './resolvers/edit-resolve.service';
import { EditComponent } from './components/edit/edit.component';
import { TypeResolveService } from './resolvers/type-resolve.service';
import { ShopCountResolveService } from './resolvers/shop-count-resolve.service';
import { ApprovedListComponent } from './components/approved-list/approved-list.component';
import { UnapprovedListComponent } from './components/unapproved-list/unapproved-list.component';
import { AssignShopComponent } from './components/assign-shop/assign-shop.component';
import { CategoryResolveService } from './resolvers/category-resolve.service';
import { ShopResolveService } from './resolvers/shop-resolve.service';
import { AttributeGroupResolveService } from './resolvers/attribute-group-resolve.service';
import { ShopManagerResolveService } from './resolvers/shopManager-resolve.service';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'list',
    component: ListComponent,
    data: { title: 'List', permissions: ['admin', 'merchant', 'shop-manager'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'approved-list',
    component: ApprovedListComponent,
    data: {
      title: 'Approved List',
      permissions: ['admin', 'merchant',],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'unapproved-list',
    component: UnapprovedListComponent,
    data: {
      title: 'Un Approved List',
      permissions: ['admin', 'merchant',],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'add',
    component: AddComponent,
    data: { title: 'Add', permissions: ['admin', 'merchant', 'shop-manager'] },
    resolve: {
      merchants: MerchantResolveService,
      shopCount: ShopCountResolveService,
      types: TypeResolveService,
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit', permissions: ['admin', 'merchant', 'shop-manager'] },
    resolve: {
      merchants: MerchantResolveService,
      shopManagers: ShopManagerResolveService,
      types: TypeResolveService,
      shop: EditResolveService,
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'assign-shop',
    component: AssignShopComponent,
    data: { title: 'Assign Shop', permissions: ['admin'] },
    resolve: {
      shopManagers: CategoryResolveService,
      shops: ShopResolveService,
      attributeGroups: AttributeGroupResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
