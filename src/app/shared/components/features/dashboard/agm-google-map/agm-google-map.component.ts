import {Component, Input, OnInit} from '@angular/core';
import {IPoint} from '../../../../../core/dto/point.dto';

@Component({
  selector: 'app-agm-google-map',
  templateUrl: './agm-google-map.component.html',
  styleUrls: ['./agm-google-map.component.scss']
})
export class AgmGoogleMapComponent implements OnInit {
  initLocation = {} as IPoint;
  initZoom = 10;

  constructor() {
  }

  @Input()
  set point(point: IPoint) {
    this.initLocation = point;
  }

  @Input()
  set zoom(zoom: number) {
    this.initZoom = zoom || 10;
  }

  ngOnInit(): void {
  }

}
