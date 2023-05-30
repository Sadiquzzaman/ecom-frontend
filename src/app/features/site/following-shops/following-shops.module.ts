import { FollowingShopsRoutingModule } from './following-shops-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SiteLayoutModule } from '../../../blocks/layout/site-layout/site-layout.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowingShopsComponent } from './components/following-shops/following-shops.component';
import { FollowingShopsService } from './following-shops.service';

@NgModule({
  declarations: [FollowingShopsComponent],
  imports: [
    CommonModule,
    SiteLayoutModule,
    // SharedModule,
    FollowingShopsRoutingModule,
  ],
  providers: [FollowingShopsService],
})
export class FollowingShopsModule {}
