import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { EditResolveService } from './resolvers/edit-resolve.service';

const routes: Routes = [
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add Configuration', permissions: ['admin'] },
  },
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'All Configuration', permissions: ['admin'] },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit Configuration', permissions: ['admin'] },
    resolve: {
      editConfiguration: EditResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
