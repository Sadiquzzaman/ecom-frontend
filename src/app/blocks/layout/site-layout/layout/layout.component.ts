import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, Type, ViewContainerRef } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { FacebookChatComponent } from '../facebook-chat/facebook-chat.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  categories: any[] = [];
  isShow = false;
  viewLoaded = false;
  lazyCom: Promise<Type<FacebookChatComponent>>;

  constructor(
    private readonly route: ActivatedRoute,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    LoaderService.categories.subscribe((res) => {
      if (res) {
        this.categories = res;
        // console.log(this.categories);
      } else {
        this.categories = this.route.snapshot.data?.categories;
        LoaderService.categories.next(this.categories);
        // console.log(this.categories);
      }
    });

    if (!this.lazyCom) {
      this.lazyCom = import('../facebook-chat/facebook-chat.component').then(
        ({ FacebookChatComponent }) => FacebookChatComponent
      );
    }
  }

  ngAfterViewInit(): void {
    this.viewLoaded = true;
  }

  showCart = () => {
    this.isShow = true;
  };
}
