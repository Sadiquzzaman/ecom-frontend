import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AddComponent} from './components/add/add.component';
import {EditComponent} from './components/edit/edit.component';
import {ListComponent} from './components/list/list.component';
import {EditResolveService} from './resolvers/edit-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {title: 'List'},
  },
  {
    path: 'add',
    component: AddComponent,
    data: {title: 'Add'},
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: {title: 'Edit'},
    resolve: {
      shopType: EditResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopTypeRoutingModule {
}
