import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { AttributeGroupResolveService } from './resolvers/attribute-group-resolve.service';
import { EditAttributeResolveService } from './resolvers/edit-attribute-resolve.service';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'add',
    component: AddComponent,
    data: { title: 'Add Product Attribute', permissions: ['admin'] },
    resolve: {
      attrGroup: AttributeGroupResolveService,
    },
  },
  {
    canActivate: [PermissionGuard],
    path: 'list/:id',
    component: ListComponent,
    data: { title: 'Product Attribute', permissions: ['admin'] },
  },
  {
    canActivate: [PermissionGuard],
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Add Product Attribute', permissions: ['admin'] },
    resolve: {
      attribute: EditAttributeResolveService,
      attrGroup: AttributeGroupResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttributeRoutingModule {}
