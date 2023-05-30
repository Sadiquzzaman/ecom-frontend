import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../home.service';

@Component({
  selector: 'app-shop-profile-product',
  templateUrl: './shop-profile-product.component.html',
  styleUrls: ['./shop-profile-product.component.scss'],
})
export class ShopProfileProductComponent implements OnInit {
  shop: any = {};
  products: any[] = [];
  currentPage = 1;
  limit = 8;
  throttle = 300;
  scrollDistance = 3;
  isLoading = true;
  totalCount = 0;

  navbar: any[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly homeService: HomeService
  ) {
    this.shop = this.route.snapshot.data?.shop;
  }

  ngOnInit(): void {
    this.getProductsByShop();
    this.initNavBar();
  }

  initNavBar = () => {
    console.log(this.shop);
    this.navbar.push({ name: 'Shop', link: '/shop' });
    this.navbar.push({
      name: this.shop.shopType.name,
      link: '/shop-type/' + this.shop.shopType.id,
    });
    this.navbar.push({
      name: this.shop.name,
      link: '',
    });

    console.log(this.navbar);
  };

  getProductsByShop = () => {
    this.isLoading = true;
    this.homeService
      .getByShopPagination(this.shop.id, this.currentPage, this.limit)
      .subscribe(
        (res) => {
          if (!res.error) {
            const products = res?.page?.data || [];
            this.totalCount = res?.page?.count || 0;
            this.products.push(...products);
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  };

  onScrollDown = (ev: Event | EventTarget | any) => {
    ++this.currentPage;
    this.getProductsByShop();
  };
}
