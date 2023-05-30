import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeService } from './home.service';
import { SiteLayoutModule } from '../../../blocks/layout/site-layout/site-layout.module';
import { ProductModule } from '../product/product.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { ShopCategoryComponent } from './components/shop-category/shop-category.component';
import { ShopProfileProductComponent } from './components/shop-profile/shop-profile-product/shop-profile-product.component';
import { ShopReviewComponent } from './components/shop-profile/shop-review/shop-review.component';
import { ShopTypeProfileComponent } from './components/shop-type-profile/shop-type-profile.component';

import { ShopProfileResolveService } from './resolvers/shop-profile-resolve.service';
import { PromotionResolveService } from './resolvers/promotion-resolve.service';
import { FollowingShopResolveService } from './resolvers/following-shop-resolve.service';
import { ShopTypeResolveService } from './resolvers/shoptype-resolve.service';
import { PopularShopResolveService } from './resolvers/popular-shop-resolve.service';
import { TrendingShopResolveService } from './resolvers/trending-shop-resolve.service';

// import { ProductComponent } from '../product/components/product/product.component';
// import { LoaderService } from 'src/app/core/services/loader.service';
// const selectedComponent = LoaderService.selectedComponent;

@NgModule({
  declarations: [
    HomeComponent,
    ShopComponent,
    ShopCategoryComponent,
    ShopProfileProductComponent,
    ShopReviewComponent,
    ShopTypeProfileComponent,
    // ProductComponent,
  ],
  imports: [
    CommonModule,
    // SharedModule,
    SiteLayoutModule,
    HomeRoutingModule,
    InfiniteScrollModule,
    ProductModule,
  ],
  providers: [
    HomeService,
    ShopProfileResolveService,
    PromotionResolveService,
    FollowingShopResolveService,
    ShopTypeResolveService,
    PopularShopResolveService,
    TrendingShopResolveService,
  ],
})
export class HomeModule {}
