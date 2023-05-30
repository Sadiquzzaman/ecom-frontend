import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SiteLayoutModule } from '../../blocks/layout/site-layout/site-layout.module';
import { SiteRoutingModule } from './site-routing.module';
import { SiteService } from './site.service';
import { CategoryResolveService } from './resolvers/category-resolve.service';
import { ShopTypeResolveService } from './resolvers/shop-type-resolve.service';
import { SharedModule } from '../../shared/shared.module';
import { BasicModule } from 'src/app/shared/basic.module';

@NgModule({
  declarations: [],
  // imports: [BasicModule, SharedModule, CommonModule, SiteLayoutModule, SiteRoutingModule],
  imports: [CommonModule, SiteLayoutModule, SiteRoutingModule],
  providers: [SiteService, CategoryResolveService, ShopTypeResolveService],
})
export class SiteModule {}
