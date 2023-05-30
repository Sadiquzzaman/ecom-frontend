import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiConfigService} from './api-config.service';
import {MicroserviceURL} from '../enum/microservices.enum';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'roles';

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  constructor(private _httpClient: HttpClient, private readonly apiConfigService: ApiConfigService) {
  }

  findAll = (): Observable<any> => this._httpClient.get(this.baseUrl);
}
