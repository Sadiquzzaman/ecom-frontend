import { TokenStorageService } from './../../../../../../core/services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopReviewDto } from './../../../../../../shared/dto/shop/shop-review.dto';
import { HomeService } from './../../../home.service';

@Component({
  selector: 'app-shop-review',
  templateUrl: './shop-review.component.html',
  styleUrls: ['./shop-review.component.scss'],
})
export class ShopReviewComponent implements OnInit {
  shopRating: number = 0;
  prevRating: number = 3;
  starCount: number = 5;
  shopReviews: ShopReviewDto[] = [];

  navbar: any[] = [];

  shop: any = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly homeService: HomeService,
    public token: TokenStorageService
  ) {
    this.shop = this.route.snapshot.data?.shop;
  }

  ngOnInit() {
    this.getReviews();
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
      link: '/shop/' + this.shop.name.replace(/\s/g, '~~'),
    });
    this.navbar.push({
      name: 'reviews',
      link: '',
    });

    console.log(this.navbar);
  };

  onRatingChanged(rating: any) {
    this.shopRating = rating;
  }

  getReviews = () => {
    this.homeService.getShopReviews(this.shop.id).subscribe((res) => {
      this.shopReviews = res?.payload?.data.map((review: any) => {
        review.shopRating = Number(review.shopRating);
        console.log(typeof review.shopRating);
        return review;
      });
      console.log(this.shopReviews);
    });
  };

  reviewSubmitted(data: any) {
    console.log(data);
    this.shopReviews.push(data);
  }
}
