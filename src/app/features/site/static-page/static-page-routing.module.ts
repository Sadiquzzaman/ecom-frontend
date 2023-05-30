import { ReturnPolicyComponent } from './component/return-policy/return-policy.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './component/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './component/terms-and-conditions/terms-and-conditions.component';
import { AboutUsComponent } from './component/about-us/about-us.component';

const routes: Routes = [
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
    data: {
      title: 'Terms & Condition',
    },
  },
  {
    path: 'privacy-policies',
    component: PrivacyPolicyComponent,
    data: {
      title: 'Privacy Policy',
    },
  },
  {
    path: 'return-policies',
    component: ReturnPolicyComponent,
    data: {
      title: 'Return Policy',
    },
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    data: {
      title: 'About Us',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticPageRoutingModule {}
