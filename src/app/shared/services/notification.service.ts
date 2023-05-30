import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from '../../core/enum/microservices.enum';
import { ApiConfigService } from '../../core/services/api-config.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  baseUrl =
    this.apiConfigService.getUrl(MicroserviceURL.NOTIFICATION) + `notifications`;

  constructor(
    private httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}
  get = (): Observable<any> => this.httpClient.get(this.baseUrl);
}
