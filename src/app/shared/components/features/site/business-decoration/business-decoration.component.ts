import { Component, Input, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import {
  fade,
  promo_fade,
} from '../../../../../../app/animation/fade.inimation';
import { ImageType } from '../../../../../../app/core/enum/image-type.enum';
import { LoaderService } from '../../../../../core/services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-decoration',
  templateUrl: './business-decoration.component.html',
  styleUrls: ['./business-decoration.component.scss'],
  animations: [fade, promo_fade],
})
export class BusinessDecorationComponent implements OnInit {
  zindex: number[] = [];
  transition: string[] = [];

  imageType = ImageType.BANNER;
  promotionData: any[] = [];

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('promotions') set setPromotions(input: any[]) {
    this.promotionData = input;
    // console.log(this.promotionData);
  }

  bannerTransition!: any;
  locationSearchStatusSubscription: Subscription;
  showMap = false;

  constructor(
    private readonly loaderService: LoaderService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.bannerTransition = timer(0, 5000);
    this.bannerTransition.subscribe((i: any) => {
      const zIndex = i % (this.promotionData?.length + 1);
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let j = 0; j <= this.promotionData?.length; j++) {
        this.zindex[j] = 1;
        this.transition[j] = 'fadeOut';
      }
      this.transition[zIndex] = 'fadeIn';
      this.zindex[zIndex] = 100;
    });

    this.locationSearchStatusSubscription =
      this.loaderService.locationSearchStatus.subscribe((res) => {
        this.showMap = res;
      });
  }

  gotoShop = (str: string) => {
    this.router.navigate(['/shop/' + str.replace(/\s/g, '~~')]);
  };
}
