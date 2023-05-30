import { ShopListComponent } from './components/shop-list/shop-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { ThanaResolveService } from './resolvers/thana-resolve.service';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';
const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'add',
    component: AddComponent,
    data: {
      title: 'add coupon',
      permissions: ['admin'],
    },
    resolve: {
      thanas: ThanaResolveService,
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'shop-list',
    component: ShopListComponent,
    data: {
      title: ':Coupon:Shop List',
      permissions: ['admin'],
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'list',
    component: ListComponent,
    data: {
      title: 'List',
      permissions: ['admin'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponRoutingModule {}
