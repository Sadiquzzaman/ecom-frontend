import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InvoiceComponent} from './components/invoice/invoice.component';

const routes: Routes = [
  {
    path: ':id',
    component: InvoiceComponent,
    data: {title: 'Invoice'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceRoutingModule {
}
