import { StaticPageService } from '../../static-page.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent implements OnInit {
  term: any;

  constructor(private readonly staticPageService: StaticPageService) {}

  ngOnInit(): void {
    this.getTermsAndConditions();
  }

  getTermsAndConditions = () => {
    this.staticPageService.getTermsAndConditions().subscribe((res) => {
      this.term = res.payload.data;
      console.log(this.term);
    });
  };
}
