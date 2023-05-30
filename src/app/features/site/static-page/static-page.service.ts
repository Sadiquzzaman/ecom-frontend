import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { ApiConfigService } from '../../../core/services/api-config.service';

@Injectable()
export class StaticPageService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'static-page';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  getTermsAndConditions = (): Observable<any> => {
    return this._httpClient.get(`${this.baseUrl}/terms`);
  };

  getPrivacyPolicy = (): Observable<any> => {
    return this._httpClient.get(`${this.baseUrl}/privacy`);
  };

  getReturnPolicy = (): Observable<any> => {
    return this._httpClient.get(`${this.baseUrl}/return`);
  };
  getAboutUs = (): Observable<any> => {
    return this._httpClient.get(`${this.baseUrl}/about`);
  };
}
