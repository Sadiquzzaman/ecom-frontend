import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.CORE) + `ticket`;

  constructor(
    private apiConfigService: ApiConfigService,
    private readonly _httpClient: HttpClient
  ) {}

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    phone: string = '',
    ticketNo: string = '',
    departmentID: string = '',
    ticketStatus: string = '',
    fromDate: string = '',
    toDate: string = ''
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&phone=${phone}&ticketNo=${ticketNo}&departmentID=${departmentID}&ticketStatus=${ticketStatus}&fromDate=${fromDate}&toDate=${toDate}`
    );

  create = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);

  changeTicketStatus = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}/change-ticket-status`, dto);

  getAll = (): Observable<any> => this._httpClient.get(`${this.baseUrl}`);
}
