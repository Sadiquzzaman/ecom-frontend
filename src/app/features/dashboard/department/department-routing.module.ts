import { DepartmentEditResolveService } from './resolvers/department-edit-resolve.service';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

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
      department: DepartmentEditResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentRoutingModule {}
