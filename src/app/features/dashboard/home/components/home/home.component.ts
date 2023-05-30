import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  contents = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'Content 1', cols: 1, rows: 1},
          {title: 'Content 2', cols: 1, rows: 1},
          {title: 'Content 3', cols: 1, rows: 1},
          {title: 'Content 4', cols: 1, rows: 1}
        ];
      }

      return [
        {title: 'Content 1', cols: 2, rows: 1},
        {title: 'Content 2', cols: 1, rows: 1},
        {title: 'Content 3', cols: 1, rows: 2},
        {title: 'Content 4', cols: 1, rows: 1}
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) {
  }
}
