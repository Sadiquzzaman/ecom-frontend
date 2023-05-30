import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-profile-header',
  templateUrl: './shop-profile-header.component.html',
  styleUrls: ['./shop-profile-header.component.scss'],
})
export class ShopProfileHeaderComponent implements OnInit {
  currentRoute = '';
  state = 'products';
  currentUrl = '';
  shopData: any = {};
  isReview: boolean = false;

  @Input('shop') set shopInit(input: any) {
    this.shopData = input;
  }
  constructor(private readonly router: Router) {
    this.currentRoute = this.router.url;
    console.log(this.currentRoute);
    if (this.currentRoute.endsWith('/reviews')) {
      this.isReview = true;
    }
  }

  ngOnInit(): void {
    this.currentUrl = '/shop/' + this.shopData?.name?.replace(/\s/g, '~~');
    console.log(this.currentUrl);
  }

  urlFriendlyShopName(name: string): string {
    const changedName = name?.replace(/\s/g, '~~');
    return changedName;
  }
}
