import { StaticPageRoutingModule } from './static-page-routing.module';
import { SiteLayoutModule } from '../../../blocks/layout/site-layout/site-layout.module';
import { SharedModule } from '../../../shared/shared.module';
import { StaticPageService } from './static-page.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './component/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './component/terms-and-conditions/terms-and-conditions.component';
import { ReturnPolicyComponent } from './component/return-policy/return-policy.component';
import { AboutUsComponent } from './component/about-us/about-us.component';

@NgModule({
  declarations: [
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    ReturnPolicyComponent,
    AboutUsComponent,
  ],
  imports: [
    CommonModule,
    // SharedModule,
    SiteLayoutModule,
    StaticPageRoutingModule,
  ],
  providers: [StaticPageService],
})
export class StaticPageModule {}
