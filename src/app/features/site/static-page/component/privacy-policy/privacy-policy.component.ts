import { StaticPageService } from '../../static-page.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  privacy: any;

  constructor(private readonly staticPageService: StaticPageService) {}

  ngOnInit(): void {
    this.getPrivacyPolicy();
  }

  getPrivacyPolicy = () => {
    this.staticPageService.getPrivacyPolicy().subscribe((res) => {
      this.privacy = res.payload.data;
      console.log(this.privacy);
    });
  };
}
