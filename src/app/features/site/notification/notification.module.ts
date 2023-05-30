import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationDetailsComponent } from './components/notification-details/notification-details.component';
import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationService } from './notification.service';

@NgModule({
  declarations: [NotificationDetailsComponent],
  imports: [CommonModule, SharedModule, NotificationRoutingModule],
  providers: [NotificationService],
})
export class NotificationModule {}
