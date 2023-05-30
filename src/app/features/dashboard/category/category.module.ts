import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { CategoryRoutingModule } from './category-routing.module';
import { ListComponent } from './components/list/list.component';
import { CategoryService } from './category.service';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { RootsResolveService } from './resolvers/roots-resolve.service';
import { EditResolveService } from './resolvers/edit-resolve.service';

@NgModule({
  declarations: [ListComponent, AddComponent, EditComponent],
  imports: [CommonModule, SharedModule, CategoryRoutingModule],
  providers: [CategoryService, RootsResolveService, EditResolveService],
})
export class CategoryModule {}
