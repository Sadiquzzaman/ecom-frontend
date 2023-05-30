import { UsersService } from './../../../../../core/services/users.service';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { ResponseService } from 'src/app/shared/services/response.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  products: any = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly loaderService: LoaderService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly rS: ResponseService
  ) {}

  ngOnInit(): void {
    this.usersService.getWishlist().subscribe((res) => {
      this.products = res.payload.data.wishlist;
      if (this.products) {
        this.loaderService.wishlist.next(this.products);
      }
    });
  }

  addAllToCart() {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.products.length; i++) {
      this.shoppingCartService.addProduct(this.products[i], 1);
      this.rS.message(
        'All products added to cart successfully!! If you want to add all products to cart please click again!!',
        false
      );
    }
  }
}
