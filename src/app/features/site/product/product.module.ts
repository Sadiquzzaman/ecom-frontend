import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { SiteLayoutModule } from '../../../blocks/layout/site-layout/site-layout.module';
import { ProductComponent } from './components/product/product.component';
import { ProductService } from './product.service';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { ProductProfileComponent } from './components/product-profile/product-profile.component';
import { ProductByIdResolveService } from './resolvers/product-by-id-resolve.service';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CategoryProfileComponent } from './components/category-profile/category-profile.component';
import { CategoryByIdResolveService } from './resolvers/category-by-id-resolve.service';
import { WishlistResolveService } from './resolvers/wishlist-resolve.service';
import { PromotionResolveService } from '../home/resolvers/promotion-resolve.service';
import { PopularProductResolveService } from './resolvers/popular-product-resolve.service';
import { TrendingProductResolveService } from './resolvers/trending-product-resolve.service';
import { NgxGalleryModule } from 'ngx-gallery-9';

@NgModule({
  imports: [
    CommonModule,
    SiteLayoutModule,
    // SharedModule,
    ProductRoutingModule,
    IvyCarouselModule,
    InfiniteScrollModule,
    NgxGalleryModule
  ],
  exports: [ProductComponent],
  declarations: [
    ProductComponent,
    ProductCategoryComponent,
    ProductProfileComponent,
    CategoryProfileComponent,
  ],
  providers: [
    ProductService,
    ProductByIdResolveService,
    CategoryByIdResolveService,
    WishlistResolveService,
    PromotionResolveService,
    PopularProductResolveService,
    TrendingProductResolveService,
  ],
})
export class ProductModule {}
