import { ShopReviewComponent } from './components/shop-profile/shop-review/shop-review.component';
import { ShopProfileProductComponent } from './components/shop-profile/shop-profile-product/shop-profile-product.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopProfileResolveService } from './resolvers/shop-profile-resolve.service';
import { PromotionResolveService } from './resolvers/promotion-resolve.service';
import { FollowingShopResolveService } from './resolvers/following-shop-resolve.service';
import { ShopTypeProfileComponent } from './components/shop-type-profile/shop-type-profile.component';
import { ShopTypeResolveService } from './resolvers/shoptype-resolve.service';
import { TrendingShopResolveService } from './resolvers/trending-shop-resolve.service';
import { PopularShopResolveService } from './resolvers/popular-shop-resolve.service';
import { PopularProductResolveService } from '../product/resolvers/popular-product-resolve.service';
import { TrendingProductResolveService } from '../product/resolvers/trending-product-resolve.service';
import { WishlistResolveService } from '../product/resolvers/wishlist-resolve.service';
import { CategoryResolveService } from '../resolvers/category-resolve.service';
import { ShopComponent } from './components/shop/shop.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

const selectedComponent = LoaderService.selectedComponent;

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home',
    },
    resolve: {
      // promotions: PromotionResolveService,
      // categories: CategoryResolveService,

      // ...(selectedComponent == 'product'
      //   ? { categories: CategoryResolveService }
      //   : {}),
      // ...(selectedComponent == 'product'
      //   ? { wishlist: WishlistResolveService }
      //   : {}),
      // ...(selectedComponent == 'product'
      //   ? { popularProducts: PopularProductResolveService }
      //   : {}),
      // ...(selectedComponent == 'product'
      //   ? { trendingProducts: TrendingProductResolveService }
      //   : {}),

      ...(selectedComponent == 'shop' && TokenStorageService.isLogged
        ? { followingShops: FollowingShopResolveService }
        : {}),
      ...(selectedComponent == 'shop'
        ? { popularShops: PopularShopResolveService }
        : {}),
      ...(selectedComponent == 'shop'
        ? { trendingShops: TrendingShopResolveService }
        : {}),
      ...(selectedComponent == 'shop'
        ? { shopTypes: ShopTypeResolveService }
        : {}),
    },
  },
  {
    path: 'shop',
    component: ShopComponent,
    data: {
      title: 'Shops',
    },
    resolve: {
      promotions: PromotionResolveService,
      popularShops: PopularShopResolveService,
      trendingShops: TrendingShopResolveService,
      shopTypes: ShopTypeResolveService,
      // followingShops: FollowingShopResolveService,
      ...(TokenStorageService.isLogged
        ? { followingShops: FollowingShopResolveService }
        : {}),
    },
  },
  {
    path: 'shop-type/:id',
    component: ShopTypeProfileComponent,
    data: {
      title: 'Shop Type profile',
    },
    resolve: {
      type: ShopTypeResolveService,
    },
  },
  {
    path: 'shop/:name',
    component: ShopProfileProductComponent,
    data: {
      title: 'Shop Profile',
    },
    resolve: {
      shop: ShopProfileResolveService,
    },
  },
  {
    path: 'shop/:name/reviews',
    component: ShopReviewComponent,
    data: {
      title: 'Shop Review',
    },
    resolve: {
      shop: ShopProfileResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
