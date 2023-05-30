import { AttributeGroupRoutingModule } from './attribute-group-routing.module';
import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { AttributeGroupService } from './attribute-group.service';
import { AttrGroupResolveService } from './resolvers/attr-group-resolve.service';
import { AttributeGroupResolveService } from './resolvers/attribute-group-resolve.service';

@NgModule({
  declarations: [AddComponent, EditComponent, ListComponent],
  imports: [CommonModule, SharedModule, AttributeGroupRoutingModule],
  providers: [
    AttributeGroupService,
    AttrGroupResolveService,
    AttributeGroupResolveService,
  ],
})
export class AttributeGroupModule {}
