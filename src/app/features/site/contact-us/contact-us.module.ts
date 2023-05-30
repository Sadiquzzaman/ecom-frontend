import { ResponseService } from '../../../shared/services/response.service';
import { SiteLayoutModule } from './../../../blocks/layout/site-layout/site-layout.module';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { ContactUsRoutingModule } from './contact-us-routing.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ContactUsService } from './contact-us.service';

@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    CommonModule,
    // SharedModule,
    SiteLayoutModule,
    ContactUsRoutingModule,
    NgxCaptchaModule,
  ],
  providers: [ContactUsService,ResponseService],
})
export class ContactUsModule {}
