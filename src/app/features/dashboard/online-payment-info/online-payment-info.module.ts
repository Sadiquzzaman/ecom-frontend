import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { OnlinePaymentInfoRoutingModule } from './online-payment-info-routing.module';
import { OrderPaymentInfoService } from './online-payment-info.service';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, SharedModule, OnlinePaymentInfoRoutingModule],
  providers: [OrderPaymentInfoService],
})
export class OnlinePaymentInfoModule {}
