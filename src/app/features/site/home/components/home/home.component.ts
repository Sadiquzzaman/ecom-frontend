import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  selectedComponent: string = LoaderService.selectedComponent;
  isProduct: boolean;

  constructor() {}

  ngOnInit(): void {
    this.isProduct = this.selectedComponent == 'product';
  }
}
