import { PromotionRoutingModule } from './promotion-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './components/add/add.component';
import { SharedModule } from '../../../shared/shared.module';
import { ProductResolveService } from './resolvers/product-resolve.service';
import { ShopResolveService } from './resolvers/shop-resolve.service';
import { PromotionService } from './promotion.service';
import { EditComponent } from './components/edit/edit.component';
import { MerchantResolveService } from './resolvers/merchant-resolve.service';
import { PromotionListsComponent } from './components/promotion-lists/promotion-lists.component';
import { ApprovedPromotionListComponent } from './components/approved-promotion-list/approved-promotion-list.component';
import { UnapprovedPromotionListComponent } from './components/unapproved-promotion-list/unapproved-promotion-list.component';
import { PromotionResolveService } from './resolvers/promotion-resolve.service';
import { SlotEditComponent } from './components/slot/slot-edit/slot-edit.component';
import { SlotAddComponent } from './components/slot/slot-add/slot-add.component';
import { SlotListComponent } from './components/slot/slot-list/slot-list.component';

@NgModule({
  declarations: [
    AddComponent,
    EditComponent,
    PromotionListsComponent,
    ApprovedPromotionListComponent,
    UnapprovedPromotionListComponent,
    SlotEditComponent,
    SlotAddComponent,
    SlotListComponent,
  ],
  imports: [CommonModule, SharedModule, PromotionRoutingModule],
  providers: [
    ShopResolveService,
    ProductResolveService,
    MerchantResolveService,
    PromotionService,
    PromotionResolveService,
  ],
})
export class PromotionModule {}
