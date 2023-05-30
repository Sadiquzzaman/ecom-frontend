import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MicroserviceURL } from 'src/app/core/enum/microservices.enum';
import { ApiConfigService } from 'src/app/core/services/api-config.service';
import { SystemService } from 'src/app/shared/services/system.service';

@Injectable()
export class AddUserService {
  otpUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'users';
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);
  //socialLoginUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=';
  countryUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'countries';
  stateUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'states';
  districtUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'districts';
  thanaUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'thanas';

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService,
    private readonly systemService: SystemService
  ) {}

  getIdsAndNamesDistricts = (): Observable<any> =>
    this._httpClient.get(`${this.districtUrl}`).pipe(
      map((res: any) => res?.payload?.data || []),
      map((data: any[]) =>
        data.length ? data.map((m: any) => ({ id: m.id, name: m.name })) : []
      )
    );

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

  register = (userDto: any): Observable<any> =>
    this._httpClient.post(this.baseUrl + 'users/registration', userDto);
}
