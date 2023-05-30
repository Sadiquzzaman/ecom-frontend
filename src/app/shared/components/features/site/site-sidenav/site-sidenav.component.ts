import { Component, Inject, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
} from '@angular/router';

@Component({
  selector: 'app-site-sidenav',
  templateUrl: './site-sidenav.component.html',
  styleUrls: ['./site-sidenav.component.scss'],
})
export class SiteSidenavComponent implements OnInit {
  tokenId: string;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  loading = false;
  categoryData: any[] = [];

  @Input('categories') set categories(input: any[]) {
    this.categoryData = input;
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    public readonly token: TokenStorageService,
    public readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.navigationLoading();
  }

  navigationLoading = () => {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  };

  ngOnInit(): void {
    this.tokenId = this.token.getUserId();
  }

  isExpanded = (routeLinks: any[]) => {
    let isExpanded = false;
    routeLinks.forEach((currentValue: string) => {
      if (this.router.url.indexOf('/dashboard/' + currentValue) != -1) {
        isExpanded = true;
        return;
      }
    });
    return isExpanded;
  };

  gotoCategoryProfile = (category: any) => {
    this.router.navigate(['/product/category/' + category.id]);
  };

  activeChecker = (categoryId: string) => {
    let isActive = '';
    const url = '/product/category/' + categoryId;

    if (this.router.url == url) {
      isActive = 'is-active';
      return;
    }

    return isActive;
  };

  redirectTo(uri: string) {
    if (this.router.url == uri) {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => this.router.navigate([uri]));
    }
  }
}
