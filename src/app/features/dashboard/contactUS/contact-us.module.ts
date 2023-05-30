import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ListComponent } from './components/list/list.component';
import { ContactUsService } from './contact-us.service';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, SharedModule, ContactUsRoutingModule],
  providers: [ContactUsService],
})
export class ContactUsModule {}
