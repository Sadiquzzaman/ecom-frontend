import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ShopRoutingModule } from './shop-routing.module';
import { ListComponent } from './components/list/list.component';
import { ShopService } from './shop.service';
import { AddComponent } from './components/add/add.component';
import { MerchantResolveService } from './resolvers/merchant-resolve.service';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../../environments/environment';
import { EditComponent } from './components/edit/edit.component';
import { EditResolveService } from './resolvers/edit-resolve.service';
import { TypeResolveService } from './resolvers/type-resolve.service';
import { ShopCountResolveService } from './resolvers/shop-count-resolve.service';
import { ApprovedListComponent } from './components/approved-list/approved-list.component';
import { UnapprovedListComponent } from './components/unapproved-list/unapproved-list.component';
import { AssignShopComponent } from './components/assign-shop/assign-shop.component';
import { CategoryResolveService } from './resolvers/category-resolve.service';
import { ShopResolveService } from './resolvers/shop-resolve.service';
import { AttributeGroupResolveService } from './resolvers/attribute-group-resolve.service';
import { ProductService } from './product.service';
import { ProductImageService } from './product-image.service';
import { ProductAttributeService } from './product-attribute.service';
import { ShopManagerResolveService } from './resolvers/shopManager-resolve.service';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    EditComponent,
    ApprovedListComponent,
    UnapprovedListComponent,
    AssignShopComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShopRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_map_api,
      libraries: ['places'],
    }),
  ],
  providers: [
    ShopService,
    MerchantResolveService,
    TypeResolveService,
    EditResolveService,
    ShopCountResolveService,
    CategoryResolveService,
    ShopResolveService,
    AttributeGroupResolveService,
    ProductService,
    ProductImageService,
    ProductAttributeService,
    ShopManagerResolveService,
  ],
})
export class ShopModule {}
