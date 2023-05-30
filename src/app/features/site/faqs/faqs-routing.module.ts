import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FAQsComponent } from './components/faqs/faqs.component';

const routes: Routes = [
  {
    path: '',
    component: FAQsComponent,
    data: {
      title: 'FAQs',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqsRoutingModule {}
