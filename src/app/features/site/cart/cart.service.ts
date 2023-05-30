import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable, of } from 'rxjs';
import { ResponseDto } from '../../../shared/dto/reponse/response.dto';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable()
export class CartService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + 'carts';
  url = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + 'orders';

  constructor(
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService,
    private loaderService: LoaderService,
    private readonly token: TokenStorageService
  ) {}

  loadCustomerCart(): Observable<ResponseDto> {
    this.loaderService.noLoading.next(true);
    const customerCartUrl = this.baseUrl + '/customer-cart';
    return this._httpClient.get(customerCartUrl) as Observable<ResponseDto>;
  }

  // loadCustomerCart(): Observable<any> {
  //   this.loaderService.noLoading.next(true);
  //   const customerCartUrl = this.baseUrl + '/customer-cart';
  //   if (this.token.isLoggedIn()) {
  //     return this._httpClient.get(customerCartUrl) as Observable<ResponseDto>;
  //   }
  //   return of([]);
  // }
}
