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
export class LoggedGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenStorageService,
    private readonly rS: ResponseService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (this.tokenService.isLoggedIn()) {
      this.router.navigate(['']);
      this.rS.message('Already logged in!', false);
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
