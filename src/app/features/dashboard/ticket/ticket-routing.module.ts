import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { DepartmentResolveService } from './resolvers/department-resolve.service';
const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: '',
    component: AddComponent,
    data: {
      title: 'add ticket',
      permissions: ['customer'],
    },
    resolve: {
      departments: DepartmentResolveService,
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'list',
    component: ListComponent,
    data: {
      title: 'List',
      permissions: ['admin', 'customer'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketRoutingModule {}
