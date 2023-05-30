import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SiteLayoutModule } from '../../../blocks/layout/site-layout/site-layout.module';
import { OrderRoutingModule } from './order-routing.module';
import { OrderService } from './order.service';
import { OrderComponent } from './components/order/order.component';
import { OrderResolveService } from './resolvers/order-resolve.service';
import { AddressService } from './address.service';

@NgModule({
  imports: [
    CommonModule,
    SiteLayoutModule,
    // SharedModule,
    OrderRoutingModule,
  ],
  declarations: [OrderComponent],
  providers: [OrderService, OrderResolveService, AddressService],
})
export class OrderModule {}
