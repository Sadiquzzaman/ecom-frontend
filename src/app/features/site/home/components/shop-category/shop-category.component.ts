import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop-category',
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.scss'],
})
export class ShopCategoryComponent implements OnInit {
  shopPromotionData: any = {};

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('shop_promotion') set shopInit(input: any) {
    this.shopPromotionData = input;
  }

  ngOnInit(): void {}
}
