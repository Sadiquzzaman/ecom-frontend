import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from '../../../core/services/api-config.service';
import {MicroserviceURL} from '../../../core/enum/microservices.enum';
import {Observable} from 'rxjs';
import {ResponseDto} from '../../../shared/dto/reponse/response.dto';

@Injectable()
export class AddressService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'addresses';
  shippingAddressId: any;
  status: boolean;
  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  getCustomerShippingAddresses = (): Observable<ResponseDto> =>
    this._httpClient.get(
      `${this.baseUrl}/customer/shipping-addresses`
    ) as Observable<ResponseDto>;

  addShippingAddress = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}/add-shipping-address`, dto);

  updateShippingAddress = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/edit-shipping-address/${id}`, dto);

  deleteShippingAddress = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);

  setShippingAddress(address: any, status: boolean) {
    this.shippingAddressId = address;
    this.status = status;
    console.log(this.shippingAddressId);
  }
  getShippingAddress() {
    return this.shippingAddressId;
  }

  formSubmitType() {
    return this.status;
  }
}
