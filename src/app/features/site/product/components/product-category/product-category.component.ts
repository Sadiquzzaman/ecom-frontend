import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
})
export class ProductCategoryComponent implements OnInit {
  productData: any = {};

  constructor() {}

  @Input('product') set productInit(input: any) {
    this.productData = input;
  }

  ngOnInit(): void {}
}
