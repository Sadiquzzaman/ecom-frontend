import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { ApiConfigService } from '../../../core/services/api-config.service';

@Injectable()
export class ContactUsService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + 'contact-us';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  createContactUs = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);
}
