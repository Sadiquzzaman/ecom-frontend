import {ApiConfigService} from '../../core/services/api-config.service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {MicroserviceURL} from '../../core/enum/microservices.enum';

@Injectable()
export class SiteService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {
  }

  login = (dataForSubmit: any): Observable<any> => this._httpClient.post(this.baseUrl + 'auth/login', dataForSubmit);

  forgetPassword = (postData: any): Observable<any> => this._httpClient.post(
    this.baseUrl + 'auth/forget-password',
    postData
  );

  changePassword = (postData: any): Observable<any> => this._httpClient.post(
    this.baseUrl + 'auth/change-password',
    postData
  );

  register = (userDto: any): Observable<any> => this._httpClient.post(this.baseUrl + 'users/registration', userDto);

  sendToken = (token: string) => this._httpClient.post<any>('/token_validate', {recaptcha: token});

  verifyOtp = (otp: number, id: string | null) => this._httpClient.post(this.baseUrl + `users/verify-otp/${id}`, {
    otp,
  });

  resendOtp = (id: string | null) => this._httpClient.post(this.baseUrl + `users/resend-otp/${id}`, {});
}
