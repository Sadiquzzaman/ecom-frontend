import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { RefundConfigEditResolveService } from './resolvers/refund-config-edit-resolve.service';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'add',
    component: AddComponent,
    data: { title: 'Add', permissions: ['admin'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'list',
    component: ListComponent,
    data: { title: 'List', permissions: ['admin'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit', permissions: ['admin'] },
    resolve: {
      refundConfig: RefundConfigEditResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefundConfigRoutingModule {}
