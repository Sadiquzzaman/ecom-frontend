import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { WishlistService } from '../../../../../../app/shared/services/wishlist.service';
import {
  fade,
  promo_cat_fade,
  zoom,
} from '../../../../../../app/animation/fade.inimation';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { ResponseService } from '../../../../services/response.service';
import { ShoppingCartService } from '../../../../services/shopping-cart.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { timer } from 'rxjs';

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.component.html',
  styleUrls: ['./product-content.component.scss'],
  animations: [
    zoom,
    fade,
    promo_cat_fade,
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition('* => void', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ProductContentComponent implements OnInit, OnDestroy {
  currentSliderIndex = 0;
  slideZIndex: number[] = [];
  slideAnim: string[] = [];
  slideLength = 0;
  zoom = 'zoom';
  sliderTransition!: any;
  sliderTransitionSubscription: any;
  myFollowingShops: any[] = [];

  @Input() products!: any[];
  @Input() promotions!: any[];

  productImageType = ImageType.PRODUCT_SMALL;
  promotionImageType = ImageType.PRODUCT_SLIDE;
  myWishList: any[] = [];
  wishListSubscription: any;

  constructor(
    private router: Router,
    private readonly token: TokenStorageService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly rS: ResponseService,
    private readonly loaderService: LoaderService,
    private readonly wishListService: WishlistService
  ) {}

  ngOnInit(): void {
    if (this.promotions) {
      for (const promotion of this.promotions) {
        this.slideZIndex.push(1);
        this.slideAnim.push('fadeIn');
      }
      this.slideLength = this.promotions?.length;
      this.sliderTransition = timer(0, 5000);
      this.sliderTransitionSubscription = this.sliderTransition.subscribe(
        (i: any) => {
          const zIndex = i % this.promotions.length;
          this.currentSliderIndex = zIndex;
          for (let j = 0; j < this.promotions.length; j++) {
            this.slideZIndex[j] = 1;
            this.slideAnim[j] = 'fadeOut';
          }
          this.slideAnim[zIndex] = 'fadeIn';
          this.slideZIndex[zIndex] = 100;
        }
      );
    }
    this.loadWishList();
  }

  loadWishList() {
    this.wishListSubscription = this.loaderService.wishlist.subscribe(
      (products) => {
        this.myWishList = products;
      }
    );
  }

  isWished(id: string) {
    let isWished = false;
    if (!this.myWishList) {
      return false;
    }
    for (const product of this.myWishList) {
      if (product.id === id) {
        isWished = true;
        break;
      }
    }
    return isWished;
  }

  onHoverIn = (index: number) => {
    this.products[index].hover = true;
  };

  onHoverOut = (index: number) => {
    this.products[index].hover = false;
  };

  addToCart = (product: any) => {
    this.shoppingCartService.addProduct(product, 1);
    this.rS.message('Added to cart successfully!!', false);
  };

  productWishList = (productId: string) => {
    if (this.token.isLoggedIn()) {
      this.wishListService
        .productWishlist({ productId, userId: this.token.getUserId() })
        .subscribe((res) => {
          if (!res.error) {
            this.loaderService.wishlist.next(res?.payload?.data?.wishlist);
          }
        });
    } else {
      // this.router.navigate(['/auth', 'login']);
      this.router.navigate(['/auth/login'], {
        state: { redirect: this.router.url },
      });
    }
  };

  removeWishList = (productId: string) => {
    if (this.token.isLoggedIn()) {
      this.wishListService.removeWishlist(productId).subscribe((res) => {
        if (!res.error) {
          this.loaderService.wishlist.next(res?.payload?.data?.wishlist);
        }
      });
    } else {
      // this.router.navigate(['/auth', 'login']);
      this.router.navigate(['/auth/login'], {
        state: { redirect: this.router.url },
      });
    }
  };

  ngOnDestroy(): void {
    if (this.wishListSubscription) {
      this.wishListSubscription.unsubscribe();
    }
    if (this.sliderTransitionSubscription) {
      this.sliderTransitionSubscription.unsubscribe();
    }
  }
}
