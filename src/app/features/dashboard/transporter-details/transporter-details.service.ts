import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable()
export class TransporterDetailsService {
  paymentBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);
  orderBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER);
  userBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER);

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService,
    private readonly token: TokenStorageService
  ) {}

  transporterTaskList = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    shippingStatus: number,
    shopId: string = '',
    fromDate: string = '',
    toDate: string = '',
    customerId: string = '',
    transporterId: string = ''
  ): Observable<any> => {
    if (this.token.isAdmin()) {
      return this._httpClient.get(
        `${this.orderBaseUrl}admin-shipping?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shippingStatus=${shippingStatus}&shopId=${shopId}&fromDate=${fromDate}&toDate=${toDate}&customerId=${customerId}&transporterId=${transporterId}`
      );
    } else {
      return this._httpClient.get(
        `${this.orderBaseUrl}transporter-shipping?page=${page}&limit=${limit}&sort=${sort}&order=${order}&shippingStatus=${shippingStatus}&shopId=${shopId}&fromDate=${fromDate}&toDate=${toDate}&customerId=${customerId}&transporterId=${transporterId}`
      );
    }
  };

  update = (id: string, status: { status: number }): Observable<any> =>
    this._httpClient.put(
      `${this.orderBaseUrl}transporter-shipping/${id}`,
      status
    );
}
