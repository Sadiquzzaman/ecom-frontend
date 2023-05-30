import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../../../services/shopping-cart.service';

@Component({
  selector: 'app-min-cart',
  templateUrl: './min-cart.component.html',
  styleUrls: ['./min-cart.component.scss'],
})
export class MinCartComponent {
  @Output() showCart = new EventEmitter<boolean>();
  cartPage = true;
  calculatedCart = {
    items: 0,
    totalAmount: 0,
    discount: 0,
    additionalShippingCharge: 0,
    vat: 0,
    shippingCharge: 0,
    grandTotal: 0,
  };
  index: number;
  unit = ['item', 'items'];
  constructor(
    private readonly router: Router,
    private readonly shoppingCartService: ShoppingCartService
  ) {
    this.router.events.subscribe((val) => {
      if (this.router.url === '/cart') {
        this.cartPage = false;
      } else {
        this.cartPage = true;
      }
    });

    // console.log(this.shoppingCartService.showPaymentPage());
    this.shoppingCartService.cart$.subscribe((cart) => {
      this.calculatedCart = this.shoppingCartService.calculateCart(cart);
      if (this.calculatedCart.items <= 1) {
        this.index = 0;
      } else {
        this.index = 1;
      }
    });
  }

  displayCart = () => {
    if (this.router.url.includes('cart')) {
      this.showCart.emit(true);
      return;
    }
    if (this.shoppingCartService.showPaymentPage()) {
      // console.log(this.router.url);
      this.showCart.emit(true);
      // this.router.navigate(['cart']);
    } else {
      this.showCart.emit(true);
    }
  };
}
