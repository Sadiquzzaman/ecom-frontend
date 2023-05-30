import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { fade, promo_cat_fade, zoom } from '../../../../../../app/animation/fade.inimation';
import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { FollowShopService } from '../../../../../../app/shared/services/follow-shop.service';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-shop-content',
  templateUrl: './shop-content.component.html',
  styleUrls: ['./shop-content.component.scss'],
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
export class ShopContentComponent implements OnInit, OnDestroy {
  currentSliderIndex = 0;
  slideZIndex: number[] = [];
  slideAnim: string[] = [];

  shopImageType = ImageType.SHOP_PROFILE_SMALL;
  promotionImageType = ImageType.SHOP_SLIDE;
  slideLength = 0;

  @Input() feeds!: any[];
  @Input() promotions!: any[];

  zoom = 'zoom';

  sliderTransition!: any;
  sliderTransitionSubscription: any;
  followingShopsSubscription: any;
  myFollowingShops: any[] = [];

  constructor(
    private router: Router,
    private readonly token: TokenStorageService,
    private readonly followShopService: FollowShopService,
    private readonly loaderService: LoaderService,
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

    this.loadFollowingShops();
  }

  loadFollowingShops() {
    this.followingShopsSubscription =
      this.loaderService.followingShops.subscribe((shops) => {
        this.myFollowingShops = shops;
      });
  }

  isFollowing(id: string) {
    let isFollowing = false;
    if (!this.myFollowingShops) {return false;}
    for (const shop of this.myFollowingShops) {
      if (shop?.id === id) {
        isFollowing = true;
        break;
      }
    }
    return isFollowing;
  }

  gotoShop = (str: string) => {
    this.router.navigate(['/shop/' + str.replace(/\s/g, '~~')]);
  };

  followingShop = (shopId: string) => {
    if (this.token.isLoggedIn()) {
      this.followShopService
        .followShop({ shopId, userId: this.token.getUserId() })
        .subscribe((res) => {
          if (!res.error) {
            this.loaderService.followingShops.next(res?.payload?.data.followingShops);
          }
        });
    } else {
      // this.router.navigate(['/auth', 'login']);
      this.router.navigate(['/auth/login'], { state: { redirect: this.router.url }});
    }
  };

  unFollowShops = (shopId: string) => {
    if (this.token.isLoggedIn()) {
      this.followShopService.unFollowShop(shopId).subscribe((res) => {
        if (!res.error) {
          this.loaderService.followingShops.next(res?.payload?.data.followingShops);
        }
      });
    } else {
      // this.router.navigate(['/auth', 'login']);
      this.router.navigate(['/auth/login'], { state: { redirect: this.router.url }});
    }
  };

  onHoverIn = (index: number) => {
    this.feeds[index].hover = true;
  };

  onHoverOut = (index: number) => {
    this.feeds[index].hover = false;
  };

  do(obj: any) {
    return JSON.stringify(obj);
  }

  ngOnDestroy(): void {
    if (this.sliderTransitionSubscription) {
      this.sliderTransitionSubscription.unsubscribe();
    }
    if (this.followingShopsSubscription) {
      this.followingShopsSubscription.unsubscribe();
    }
  }
}
