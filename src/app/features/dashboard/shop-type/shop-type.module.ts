import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {ListComponent} from './components/list/list.component';
import {AddComponent} from './components/add/add.component';
import {EditComponent} from './components/edit/edit.component';
import {EditResolveService} from './resolvers/edit-resolve.service';
import {ShopTypeService} from './shop-type.service';
import {ShopTypeRoutingModule} from './shop-type-routing.module';

@NgModule({
  declarations: [ListComponent, AddComponent, EditComponent],
  imports: [CommonModule, SharedModule, ShopTypeRoutingModule],
  providers: [ShopTypeService, EditResolveService],
})
export class ShopTypeModule {
}
