import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  logo = 1;
  companyImageType = 1;

  constructor() {
  }

  ngOnInit(): void {
  }
}
