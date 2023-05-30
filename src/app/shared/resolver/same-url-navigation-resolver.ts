import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { NEVER, Observable, of } from 'rxjs';

export class SameUrlNavigationResolver implements Resolve<any> {
  private previousUrl: string;

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    if (this.refresh(state.url)) {
      this.previousUrl = state.url;
      return fetchData();
    }
    this.previousUrl = state.url;
    return NEVER;
  }

  private refresh(currentUrl: string): boolean {
    return !this.previousUrl || this.previousUrl === currentUrl;
  }
}

function fetchData(): Observable<any> {
  return of([true]);
}
