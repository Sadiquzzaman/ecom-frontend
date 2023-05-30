import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MicroserviceURL} from '../../core/enum/microservices.enum';
import {ApiConfigService} from '../../core/services/api-config.service';

@Injectable()
export class DashboardService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE);

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {
  }
}
