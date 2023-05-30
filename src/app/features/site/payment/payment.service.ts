import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from '../../../core/services/api-config.service';
import {MicroserviceURL} from '../../../core/enum/microservices.enum';
import {Observable} from 'rxjs';
import {ResponseDto} from '../../../shared/dto/reponse/response.dto';

@Injectable()
export class PaymentService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + 'orders';

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService,
  ) {
  }

  getByID = (id: string): Observable<ResponseDto> => this._httpClient.get(`${this.baseUrl}/${id}`) as Observable<ResponseDto>;
}
