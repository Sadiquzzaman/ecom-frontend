import {Injectable} from '@angular/core';
import {ApiConfigService} from '../../../core/services/api-config.service';
import {MicroserviceURL} from '../../../core/enum/microservices.enum';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class InvoiceService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT) + 'invoices';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService,
  ) {
  }
}
