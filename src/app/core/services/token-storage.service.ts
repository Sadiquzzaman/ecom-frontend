import { MapsAPILoader } from '@agm/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { ApiConfigService } from './api-config.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const storage = 'localStorage'; // sessionStorage

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  DASHBOARD = '/dashboard';

  companyInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  } = {
    name: this.apiConfigService.getCompanyName(),
    phone: this.apiConfigService.getCompanyPhone(),
    email: this.apiConfigService.getCompanyEmail(),
    address: '',
  };

  constructor(
    private readonly router: Router,
    private readonly apiConfigService: ApiConfigService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly jwtHelper: JwtHelperService,
    private readonly mapsAPILoader: MapsAPILoader
  ) {
    mapsAPILoader.load().then(() => {
      const geoCoder: any = new google.maps.Geocoder();
      const location = {
        lat: apiConfigService.getCompanyLocation().x,
        lng: apiConfigService.getCompanyLocation().y,
      };
      return geoCoder.geocode({ location }, (results: any[], status: any) => {
        if (status === 'OK') {
          if (results.length) {
            this.companyInfo.address = results[0].formatted_address;
          }
        }
      });
    });
  }

  public saveToken = (token: string): void => {
    window[storage].removeItem(TOKEN_KEY);
    window[storage].setItem(TOKEN_KEY, token);
  };

  public getToken = (): string | null => window[storage].getItem(TOKEN_KEY);

  public removeToken = (): void => {
    window[storage].removeItem(TOKEN_KEY);
  };

  public saveUser = (user: any): void => {
    window[storage].removeItem(USER_KEY);
    window[storage].setItem(USER_KEY, JSON.stringify(user));
  };

  public removeUser = (): void => {
    window[storage].removeItem(USER_KEY);
  };

  public signOut = (): void => {
    this.removeToken();
    this.removeUser();
    window.localStorage.clear();
    this.shoppingCartService.clearAllKey();
    this.router.navigate(['/auth/login']);
    //this.router.navigate(['/auth/login'], { state: { redirect: this.router.url } });
  };

  public getCompanyInfo = (): any => this.companyInfo;

  public getUser = (): any => {
    const user = window[storage].getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  };

  public getUserId = (): any => {
    const user = window[storage].getItem(USER_KEY);

    if (user) {
      return JSON.parse(user).payload.data.userId;
    }

    return {};
  };

  public isLoggedIn = (): boolean => !!this.getToken();

  public isSuperAdmin = (): boolean => {
    if (this.isLoggedIn()) {
      return this.getUser().payload?.data?.isSuperAdmin;
    }
    return false;
  };

  public isAdmin = (): boolean => {
    if (this.isLoggedIn()) {
      const isAdmin =
        this.getUser().payload?.data?.isAdmin ||
        this.getUser().payload?.data?.isSuperAdmin;
      return isAdmin;
    }
    return false;
  };

  public isTransporter = (): boolean => {
    if (this.isLoggedIn()) {
      const isTransporter = this.getUser().payload?.data?.isTransporter;
      return isTransporter;
    }
    return false;
  };

  public isShopManager = (): boolean => {
    if (this.isLoggedIn()) {
      const isTransporter = this.getUser().payload?.data?.isShopManager;
      return isTransporter;
    }
    return false;
  };

  public hasLicenseAndNID = (): boolean => {
    if (this.isLoggedIn()) {
      const hasLicenseAndNID = this.getUser().payload?.data?.hasLicenseAndNID;
      return hasLicenseAndNID;
    }
    return false;
  };

  public isMerchant = (): boolean => {
    if (this.isLoggedIn()) {
      return this.getUser().payload?.data?.isMerchant;
    }
    return false;
  };

  public isCustomer = (): boolean => {
    if (this.isLoggedIn()) {
      return this.getUser().payload?.data?.isCustomer;
    }
    return false;
  };

  public isOnlyCustomer = (): boolean => {
    if (!this.isLoggedIn()) {
      return false;
    }
    if (
      this.isSuperAdmin() ||
      this.isAdmin() ||
      this.isMerchant() ||
      this.isAffiliator() ||
      this.isEmployee()
    ) {
      return false;
    }
    return this.isCustomer();
  };

  public isAffiliator = (): boolean => {
    if (this.isLoggedIn()) {
      return this.getUser().payload?.data?.isAffiliator;
    }
    return false;
  };

  public isEmployee = (): boolean => {
    if (this.isLoggedIn()) {
      return this.getUser().payload?.data?.isEmployee;
    }
    return false;
  };

  public isUser = (): boolean => {
    if (this.isLoggedIn()) {
      return this.getUser().payload?.data?.isUser;
    }
    return false;
  };

  public getRoles = (): any => {
    if (this.isLoggedIn()) {
      return this.getUser().payload?.data?.roles;
    }
    return {};
  };

  static getToken = (): string | null => window[storage].getItem(TOKEN_KEY);

  public static isLogged: boolean = !!TokenStorageService.getToken();
}
