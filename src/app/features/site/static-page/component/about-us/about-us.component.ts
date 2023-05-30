import { Component, OnInit } from '@angular/core';
import { StaticPageService } from '../../static-page.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  aboutUs: any;

  constructor(private readonly staticPageService: StaticPageService) {}

  ngOnInit(): void {
    this.getAboutUs();
  }

  getAboutUs = () => {
    this.staticPageService.getAboutUs().subscribe((res) => {
      this.aboutUs = res.payload.data;
      console.log(this.aboutUs);
    });
  };
}
