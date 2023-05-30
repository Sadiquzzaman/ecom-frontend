import { Component, Inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { ResponseService } from '../../../../shared/services/response.service';
import { ApiConfigService } from '../../../../core/services/api-config.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
} from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  tokenId: string;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  // loading = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public readonly token: TokenStorageService,
    private readonly rS: ResponseService,
    private readonly apiConfigService: ApiConfigService,
    public readonly router: Router,
    private readonly loaderService: LoaderService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.navigationLoading();
  }

  navigationLoading = () => {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          // this.loading = true;
          this.loaderService.isLoading.next(true);
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          // this.loading = false;
          this.loaderService.isLoading.next(false);
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

  logOut(): void {
    this.token.signOut();
    // this.goLoginPage();
    this.rS.message('Logged out', false);
  }

  goLoginPage = () => {
    this.document.location.href = this.apiConfigService.getLoginUrl();
  };

  gotoChangePassword = (token: any) => {
    this.router.navigate(['/auth/reset-password/' + token]);
  };

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

  activeChecker = (routeLinks: any[]) => {
    let isActive = '';
    routeLinks.forEach((currentValue: string) => {
      let exactMatch = true;
      if (
        currentValue.indexOf('/edit') != -1 ||
        currentValue.indexOf('/details') != -1
      ) {
        exactMatch = false;
      }

      const url = '/dashboard/' + currentValue;

      if (exactMatch) {
        if (this.router.url == url) {
          isActive = 'is-active';
          return;
        }
      } else {
        if (this.router.url.indexOf(url) != -1) {
          isActive = 'is-active';
          return;
        }
      }
    });
    return isActive;
  };

  redirectTo(uri: string) {
    if (this.router.url == uri) {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => this.router.navigate([uri]));
    }
  }

  // activeCheckerOld = (
  //   mainLink: string,
  //   activeLink: string = '/edit',
  //   anotherActiveLink: string = ''
  // ) => {
  //   let classActive =
  //     this.router.url == mainLink ||
  //     this.router.url.indexOf(mainLink + activeLink) != -1 ||
  //     (anotherActiveLink
  //       ? this.router.url.indexOf(mainLink + anotherActiveLink) != -1
  //       : false)
  //       ? 'is-active'
  //       : '';
  //   return classActive;
  // };
}
