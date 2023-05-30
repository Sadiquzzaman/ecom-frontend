import { AfterViewChecked, Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit, AfterViewChecked {
  
  status = 0;
  isHidden = 0;

  constructor() { }

  ngAfterViewChecked(): void { }

  ngOnInit(): void { }

  onClick($event: any) {
    // console.log($event.index);
    this.isHidden = $event.index;
  }
}
