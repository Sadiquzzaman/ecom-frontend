import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransporterDetailsRoutingModule } from './transporter-details-routing.module';
import { TransporterDetailsService } from './transporter-details.service';
import { AssignedListComponent } from './components/assigned-list/assigned-list.component';
import { DeliveredListComponent } from './components/delivered-list/delivered-list.component';
import { PickedListComponent } from './components/picked-list/picked-list.component';

@NgModule({
  declarations: [
    AssignedListComponent,
    DeliveredListComponent,
    PickedListComponent,
  ],
  imports: [CommonModule, TransporterDetailsRoutingModule, SharedModule],
  providers: [TransporterDetailsService],
})
export class TransporterDetailsModule {}
