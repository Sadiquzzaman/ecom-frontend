import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { ApiConfigService } from '../../../core/services/api-config.service';

@Injectable()
export class NotificationService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.NOTIFICATION) + 'notifications';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService,
  ) { }
  get = (): Observable<any> =>  this._httpClient.get(this.baseUrl);
}
