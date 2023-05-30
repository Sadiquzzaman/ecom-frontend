import { SharedModule } from '../../../shared/shared.module';
import { SiteLayoutModule } from './../../../blocks/layout/site-layout/site-layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FAQsComponent } from './components/faqs/faqs.component';
import { FaqsRoutingModule } from './faqs-routing.module';

@NgModule({
  declarations: [FAQsComponent],
  imports: [
    CommonModule,
    SiteLayoutModule,
    // SharedModule,
    FaqsRoutingModule,
  ],
})
export class FAQsModule {}
