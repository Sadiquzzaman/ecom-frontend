import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { ShippingAddressResolveService } from './resolvers/shipping-address-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: CartComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'User Shopping Cart',
    },
    resolve: {
      shippingAddresses: ShippingAddressResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
