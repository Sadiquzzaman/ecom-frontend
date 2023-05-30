import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../../../../../app/shared/services/review.service';
import { TokenStorageService } from '../../../../../../app/core/services/token-storage.service';
import { Router } from '@angular/router';
import { ProductReviewDto } from '../../../../../../app/shared/dto/product/product-review.dto';
import { ShopReviewDto } from '../../../../../../app/shared/dto/shop/shop-review.dto';
import { ResponseService } from '../../../../../../app/shared/services/response.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ReviewComponent implements OnInit {
  source!: string;
  productId!: string;
  shopId!: string;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('rating') rating = 0;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('starCount') starCount = 5;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('source') set setSource(input: any) {
    this.source = input;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('productId') set setProductId(input: any) {
    this.productId = input;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('shopId') set setShopId(input: any) {
    this.shopId = input;
  }

  @Output() public ratingUpdated = new EventEmitter();

  @Output() productReviewEmitter: EventEmitter<ProductReviewDto> =
    new EventEmitter<ProductReviewDto>();

  @Output() shopReviewEmitter: EventEmitter<ShopReviewDto> =
    new EventEmitter<ShopReviewDto>();

  public ratingArr: number[] = [];
  reviewForm!: FormGroup;
  isPostSubmitted = false;

  constructor(
    private readonly reviewService: ReviewService,
    public readonly token: TokenStorageService,
    private readonly router: Router,
    private readonly snackBarService: ResponseService
  ) {}

  ngOnInit(): void {
    this.initForm();
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onClick(curRating: number) {
    this.reviewForm.controls.starRate.setValue(curRating);
    this.ratingUpdated.emit(curRating);
    this.rating = curRating;
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  initForm = () => {
    this.reviewForm = new FormGroup({
      starRate: new FormControl(null, [Validators.required]),
      review: new FormControl(null, [Validators.required]),
    });
  };

  postReview = () => {
    this.isPostSubmitted = true;
    if (!this.token.isLoggedIn()) {
      // this.router.navigate(['/auth/login']);
      this.router.navigate(['/auth/login'], {
        state: { redirect: this.router.url },
      });
      return;
    }
    const data = this.reviewForm.value;

    if (this.source === 'product' && this.productId && this.reviewForm.valid) {
      this.reviewService
        .createProductReview(data, this.productId)
        .subscribe((res) => {
          this.snackBarService.fire(res);
          this.reviewForm.reset();
          this.isPostSubmitted = false;
          this.rating = 0;
          this.productReviewEmitter.emit(res?.payload?.data);
        });
    } else if (this.source === 'shop' && this.shopId && this.reviewForm.valid) {
      this.reviewService
        .createShopReview(data, this.shopId)
        .subscribe((res) => {
          this.snackBarService.fire(res);
          this.reviewForm.reset();
          this.isPostSubmitted = false;
          this.rating = 0;
          this.shopReviewEmitter.emit(res?.payload?.data);
        });
    }
  };
}
