import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SiteLayoutModule } from '../../../blocks/layout/site-layout/site-layout.module';
import { PaymentService } from './payment.service';
import { PaymentRoutingModule } from './payment-routing.module';
import { SuccessComponent } from './components/success/success.component';
import { FailComponent } from './components/fail/fail.component';
import { CancelComponent } from './components/cancel/cancel.component';

@NgModule({
  imports: [
    CommonModule,
    SiteLayoutModule,
    // SharedModule,
    PaymentRoutingModule,
  ],
  declarations: [SuccessComponent, FailComponent, CancelComponent],
  providers: [PaymentService],
})
export class PaymentModule {}
