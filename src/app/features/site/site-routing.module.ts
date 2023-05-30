import { NgModule } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../blocks/layout/site-layout/layout/layout.component';
import { CategoryResolveService } from './resolvers/category-resolve.service';
import { ShopTypeResolveService } from './resolvers/shop-type-resolve.service';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
        // resolve: {
        //   categories: CategoryResolveService,
        //   // shopTypes: ShopTypeResolveService,
        // },
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./product/product.module').then((m) => m.ProductModule),
        // resolve: {
        //   categories: CategoryResolveService,
        // },
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'order',
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderModule),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('./payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: 'FAQs',
        loadChildren: () =>
          import('./faqs/faqs.module').then((m) => m.FAQsModule),
      },
      {
        path: 'wishlist',
        loadChildren: () =>
          import('./wishlist/wishlist.module').then((m) => m.WishlistModule),
      },
      {
        path: 'following-shops',
        loadChildren: () =>
          import('./following-shops/following-shops.module').then(
            (m) => m.FollowingShopsModule
          ),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./notification/notification.module').then(
            (m) => m.NotificationModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./static-page/static-page.module').then(
            (m) => m.StaticPageModule
          ),
      },

      {
        path: 'contacts-us',
        loadChildren: () =>
          import('./contact-us/contact-us.module').then(
            (m) => m.ContactUsModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteRoutingModule {}
