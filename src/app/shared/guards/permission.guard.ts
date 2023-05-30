import {
  Router,
  UrlTree,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ResponseService } from '../services/response.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private location: Location,
    private router: Router,
    private readonly token: TokenStorageService,
    private readonly rS: ResponseService // private routeActivated: ActivatedRoute,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let permissions = [];
    if (route.data.permissions) {
      permissions = route.data.permissions;
    }

    if (permissions.length) {
      let permitted = false;

      permissions.some((role: string) => {
        let permission = role.toLowerCase();

        if (permission == 'user' && this.token.isUser()) {
          permitted = true;
        }

        if (permission == 'admin' && this.token.isAdmin()) {
          permitted = true;
        }

        if (permission == 'merchant' && this.token.isMerchant()) {
          permitted = true;
        }

        if (permission == 'customer' && this.token.isCustomer()) {
          permitted = true;
        }

        if (permission == 'employee' && this.token.isEmployee()) {
          permitted = true;
        }

        if (permission == 'affiliator' && this.token.isAffiliator()) {
          permitted = true;
        }

        if (permission == 'transporter' && this.token.isTransporter()) {
          permitted = true;
        }

        if (permission == 'shop-manager' && this.token.isShopManager()) {
          permitted = true;
        }

        if (permitted == true) {
          return true;
        } else {
          return false;
        }
      });

      if (permitted == false) {
        console.log(this.location);
        this.location.back();

        // this.router.navigate(['/dashboard']);

        this.rS.message(
          'You have no permission to access this!!!',
          true,
          10000
        );

        return false;
      }

      return true;
    }

    return true;
  }
}
