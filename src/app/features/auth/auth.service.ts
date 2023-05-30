import { ApiConfigService } from '../../core/services/api-config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MicroserviceURL } from '../../core/enum/microservices.enum';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  otpUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'users';
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);
  //socialLoginUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=';
  countryUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'countries';
  stateUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'states';
  districtUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'districts';
  thanaUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'thanas';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  googleLogin = (idToken: any): Observable<any> =>
    this._httpClient.post(this.baseUrl + 'auth/google-auth', idToken);

  facebookLogin = (idToken: any): Observable<any> =>
    this._httpClient.post(this.baseUrl + 'auth/facebook-auth', idToken);

  getUser = (id: string | null): Observable<any> =>
    this._httpClient.get(this.otpUrl + '/inactive/' + id);

  login = (dataForSubmit: any): Observable<any> =>
    this._httpClient.post(this.baseUrl + 'auth/login', dataForSubmit);

  forgetPassword = (postData: any): Observable<any> =>
    this._httpClient.post(this.baseUrl + 'auth/forget-password', postData);

  changePassword = (postData: any): Observable<any> =>
    this._httpClient.post(this.baseUrl + 'auth/change-password', postData);

  resetPassword = (postData: any): Observable<any> =>
    this._httpClient.post(this.baseUrl + 'auth/reset-password', postData);

  register = (userDto: any): Observable<any> =>
    this._httpClient.post(this.baseUrl + 'users/registration', userDto);

  sendToken = (token: string) =>
    this._httpClient.post<any>('/token_validate', { recaptcha: token });

  verifyOtp = (otp: number, id: string | null) =>
    this._httpClient.post(this.baseUrl + `users/verify-otp/${id}`, {
      otp,
    });

  resendOtp = (id: string | null) =>
    this._httpClient.post(this.baseUrl + `users/resend-otp/${id}`, {});

  createAddress = (addressDto: any): Observable<any> =>
    this._httpClient.post(this.baseUrl + 'addresses', addressDto);

  getIdsAndNamesCountries = (): Observable<any> =>
    this._httpClient.get(`${this.countryUrl}`).pipe(
      map((res: any) => res?.payload?.data || []),
      map((data: any[]) =>
        data.length ? data.map((m: any) => ({ id: m.id, name: m.name })) : []
      )
    );

  getIdsAndNamesDistricts = (): Observable<any> =>
    this._httpClient.get(`${this.districtUrl}`).pipe(
      map((res: any) => res?.payload?.data || []),
      map((data: any[]) =>
        data.length ? data.map((m: any) => ({ id: m.id, name: m.name })) : []
      )
    );

  getIdsAndNamesStatesByCountry = (countryID: string): Observable<any> => {
    if (!countryID) {
      return of([]);
    }
    return this._httpClient
      .get(`${this.stateUrl}/find/country/${countryID}`)
      .pipe(
        map((res: any) => res?.payload?.data || []),
        map((data: any[]) =>
          data.length ? data.map((m: any) => ({ id: m.id, name: m.name })) : []
        )
      );
  };

  getIdsAndNamesDistrictsByState = (stateID: string): Observable<any> => {
    if (!stateID) {
      return of([]);
    }
    return this._httpClient
      .get(`${this.districtUrl}/find/state/${stateID}`)
      .pipe(
        map((res: any) => res?.payload?.data || []),
        map((data: any[]) =>
          data.length ? data.map((m: any) => ({ id: m.id, name: m.name })) : []
        )
      );
  };

  getIdsAndNamesThanasByDistrict = (districtID: string): Observable<any> => {
    if (!districtID) {
      return of([]);
    }
    return this._httpClient
      .get(`${this.thanaUrl}/find/district/${districtID}`)
      .pipe(
        map((res: any) => res?.payload?.data || []),
        map((data: any[]) =>
          data.length ? data.map((m: any) => ({ id: m.id, name: m.name })) : []
        )
      );
  };
}
