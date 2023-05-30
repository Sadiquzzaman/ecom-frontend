import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductService } from './product.service';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { EditResolveService } from './resolvers/edit-resolve.service';
import { CategoryResolveService } from './resolvers/category-resolve.service';
import { ShopResolveService } from './resolvers/shop-resolve.service';
import { AttributeGroupResolveService } from './resolvers/attribute-group-resolve.service';
import { ProductAttributeService } from './product-attribute.service';
import { ProductImageService } from './product-image.service';
import { ApprovedListComponent } from './components/approved-list/approved-list.component';
import { UnapprovedListComponent } from './components/unapproved-list/unapproved-list.component';

@NgModule({
  declarations: [
    AddComponent,
    ListComponent,
    EditComponent,
    ApprovedListComponent,
    UnapprovedListComponent,
  ],
  imports: [CommonModule, SharedModule, ProductRoutingModule],
  providers: [
    ProductService,
    ProductImageService,
    ProductAttributeService,
    EditResolveService,
    CategoryResolveService,
    ShopResolveService,
    AttributeGroupResolveService,
  ],
})
export class ProductModule {}
