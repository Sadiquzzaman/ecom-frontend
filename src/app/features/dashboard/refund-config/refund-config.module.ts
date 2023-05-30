import { RefundConfigService } from './refund-config.service';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundConfigRoutingModule } from './refund-config-routing.module';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { RefundConfigEditResolveService } from './resolvers/refund-config-edit-resolve.service';

@NgModule({
  declarations: [AddComponent, EditComponent, ListComponent],
  imports: [CommonModule, SharedModule, RefundConfigRoutingModule],
  providers: [RefundConfigService, RefundConfigEditResolveService],
})
export class RefundConfigModule {}
