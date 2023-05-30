import { Component, OnInit } from '@angular/core';
import { StaticPageService } from '../../static-page.service';

@Component({
  selector: 'app-return-policy',
  templateUrl: './return-policy.component.html',
  styleUrls: ['./return-policy.component.scss'],
})
export class ReturnPolicyComponent implements OnInit {
  returnPolicy: any;

  constructor(private readonly staticPageService: StaticPageService) {}

  ngOnInit(): void {
    this.getReturnPolicy();
  }

  getReturnPolicy = () => {
    this.staticPageService.getReturnPolicy().subscribe((res) => {
      this.returnPolicy = res.payload.data;
      console.log(this.returnPolicy);
    });
  };
}
