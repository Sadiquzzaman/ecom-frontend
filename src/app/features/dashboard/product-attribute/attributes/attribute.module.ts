import { SharedModule } from '../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { AttributeRoutingModule } from './attribute-routing.module';
import { AttributeGroupResolveService } from './resolvers/attribute-group-resolve.service';
import { AttributeService } from './attribute.service';
import { EditAttributeResolveService } from './resolvers/edit-attribute-resolve.service';

@NgModule({
  declarations: [AddComponent, EditComponent, ListComponent],
  imports: [CommonModule, SharedModule, AttributeRoutingModule],
  providers: [
    AttributeService,
    AttributeGroupResolveService,
    EditAttributeResolveService,
  ],
})
export class AttributeModule {}
