import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.component.html',
  styleUrls: ['./notification-details.component.scss'],
})
export class NotificationDetailsComponent implements OnInit {
  menuText = '';
  checkStatus: boolean;
  constructor() { }
  notifications: any[] = [];

  ngOnInit(): void {
    this.changeCheckStatus();
  }

  changeCheckStatus = () => {
    this.checkStatus = !this.checkStatus;
    console.log(this.checkStatus);
    if (this.checkStatus === true) {
      this.menuText = 'Mark As Unread';
    } else if (this.checkStatus === false) {
      this.menuText = 'Mark As Read';
    }
  };
}
