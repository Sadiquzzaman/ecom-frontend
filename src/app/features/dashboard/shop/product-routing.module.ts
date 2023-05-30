import { UnapprovedListComponent } from './components/unapproved-list/unapproved-list.component';
import { ApprovedListComponent } from './components/approved-list/approved-list.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { EditResolveService } from './resolvers/edit-resolve.service';
import { CategoryResolveService } from './resolvers/category-resolve.service';
import { ShopResolveService } from './resolvers/shop-resolve.service';
import { AttributeGroupResolveService } from './resolvers/attribute-group-resolve.service';

const routes: Routes = [
  {
    path: 'list',
    pathMatch: 'full',
    component: ListComponent,
    data: { title: 'List' },
  },
  {
    path: 'approved-list',
    component: ApprovedListComponent,
    data: { title: 'Approved List' },
  },
  {
    path: 'unapproved-list',
    component: UnapprovedListComponent,
    data: { title: 'Un Approved List' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add' },
    resolve: {
      categories: CategoryResolveService,
      shops: ShopResolveService,
      attributeGroups: AttributeGroupResolveService,
    },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit' },
    resolve: {
      categories: CategoryResolveService,
      shops: ShopResolveService,
      attributeGroups: AttributeGroupResolveService,
      product: EditResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
