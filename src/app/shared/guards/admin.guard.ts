import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { TokenStorageService } from '../../core/services/token-storage.service';
import { ResponseService } from '../services/response.service';

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenStorageService,
    private readonly rS: ResponseService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (!this.tokenService.isSuperAdmin() || !this.tokenService.isAdmin()) {
      this.router.navigate(['']);
      this.rS.message(
        'Access protected! Only Admin / Super Admin can access!!',
        false
      );
      return of(false);
    }
    return of(true);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }
}
