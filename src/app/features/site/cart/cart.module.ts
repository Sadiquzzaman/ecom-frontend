import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SiteLayoutModule } from '../../../blocks/layout/site-layout/site-layout.module';
import { CartComponent } from './components/cart/cart.component';
import { CartService } from './cart.service';
import { CartRoutingModule } from './cart-routing.module';
import { AddressService } from '../order/address.service';
import { LoaderService } from '../../../../app/core/services/loader.service';
import { ShippingAddressResolveService } from './resolvers/shipping-address-resolve.service';

@NgModule({
  imports: [
    CommonModule,
    SiteLayoutModule,
    // SharedModule,
    CartRoutingModule,
  ],
  declarations: [CartComponent],
  providers: [
    CartService,
    AddressService,
    LoaderService,
    ShippingAddressResolveService,
  ],
})
export class CartModule {}
