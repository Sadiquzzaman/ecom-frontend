import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ListComponent} from './components/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {title: 'All Contact US'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactUsRoutingModule {
}
