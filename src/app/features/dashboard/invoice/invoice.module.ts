import { SharedModule } from '../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { InvoiceService } from './invoice.service';
import { InvoiceRoutingModule } from './invoice-routing.module';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, SharedModule, InvoiceRoutingModule],
  providers: [InvoiceService],
})
export class OnlinePaymentInfoModule {}
