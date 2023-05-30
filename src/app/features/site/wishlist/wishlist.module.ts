import { WishlistRoutingModule } from './wishlist-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SiteLayoutModule } from './../../../blocks/layout/site-layout/site-layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { WishlistService } from './wishlist.service';

@NgModule({
  declarations: [WishlistComponent],
  imports: [
    CommonModule,
    SiteLayoutModule,
    // SharedModule,
    WishlistRoutingModule,
  ],
  providers: [WishlistService],
})
export class WishlistModule {}
