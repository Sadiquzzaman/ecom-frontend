import { UnapprovedListComponent } from './components/unapproved-list/unapproved-list.component';
import { ApprovedListComponent } from './components/approved-list/approved-list.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { EditResolveService } from './resolvers/edit-resolve.service';
import { CategoryResolveService } from './resolvers/category-resolve.service';
import { ShopResolveService } from './resolvers/shop-resolve.service';
import { AttributeGroupResolveService } from './resolvers/attribute-group-resolve.service';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'list',
    pathMatch: 'full',
    component: ListComponent,
    data: { title: 'List', permissions: ['admin', 'merchant', 'shop-manager'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'approved-list',
    component: ApprovedListComponent,
    data: {
      title: 'Approved List',
      permissions: ['admin',],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'unapproved-list',
    component: UnapprovedListComponent,
    data: {
      title: 'UnApproved List',
      permissions: ['admin',],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'add',
    component: AddComponent,
    data: { title: 'Add', permissions: ['admin', 'merchant'] },
    resolve: {
      categories: CategoryResolveService,
      shops: ShopResolveService,
      attributeGroups: AttributeGroupResolveService,
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit', permissions: ['admin', 'merchant'] },
    resolve: {
      categories: CategoryResolveService,
      shops: ShopResolveService,
      attributeGroups: AttributeGroupResolveService,
      product: EditResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
