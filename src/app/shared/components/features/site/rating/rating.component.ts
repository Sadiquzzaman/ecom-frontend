import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  @Input('rating') rating: number | undefined = 0;
  @Input('starCount') starCount: number = 5;
  @Input('color') color: string = 'accent';
  @Output() ratingUpdated = new EventEmitter();

  ratingArr: number[] = [];

  constructor() {}

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  showIcon(index: number) {
    if (<number>this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
