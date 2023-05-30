import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { MicroserviceURL } from '../enum/microservices.enum';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoryUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + 'categories/trees';

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  constructor(
    private _httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  findAll = (): Observable<any> =>
    this._httpClient
      .get(`${this.categoryUrl}`)
      .pipe(map((res: any) => res?.payload?.data || []));
}
