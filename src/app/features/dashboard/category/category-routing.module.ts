import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { RootsResolveService } from './resolvers/roots-resolve.service';
import { EditResolveService } from './resolvers/edit-resolve.service';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: '',
    component: ListComponent,
    data: { title: 'All Categories', permissions: ['admin'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'add',
    component: AddComponent,
    data: { title: 'Add', permissions: ['admin'] },
    resolve: {
      roots: RootsResolveService,
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit', permissions: ['admin'] },
    resolve: {
      roots: RootsResolveService,
      category: EditResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
