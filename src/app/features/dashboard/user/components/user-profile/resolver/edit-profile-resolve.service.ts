import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { TokenStorageService } from '../../../../../../core/services/token-storage.service';
import { UserProfileService } from '../userprofile.service';

@Injectable()
export class EditProfileResolveService implements Resolve<any> {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly token: TokenStorageService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.userProfileService
      .getUserProfile(this.token.getUserId())
      .pipe(map((res: any) => res?.payload?.data || {}));
  }
}
