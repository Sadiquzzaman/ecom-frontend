import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../../../app/shared/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  notificationCount: number;
  checkStatus: boolean;
  notifications: any;

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.get().subscribe((res) => {
      this.notifications = res?.payload?.data;
    });
  }
}
