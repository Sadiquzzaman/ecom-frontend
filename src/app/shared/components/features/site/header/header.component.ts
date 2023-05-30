import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import { Component } from '@angular/core';
import { ApiConfigService } from '../../../../../core/services/api-config.service';
import { Router } from '@angular/router';
import { ResponseService } from 'src/app/shared/services/response.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  companyInfo: any = this.apiConfigService.getCompanyInfo();

  constructor(
    private readonly apiConfigService: ApiConfigService,
    public readonly token: TokenStorageService,
    private readonly rS: ResponseService,
    public readonly router: Router
  ) {}

  logOut(): void {
    this.token.signOut();
    // this.goLoginPage();
    this.rS.message('Logged out', false);
  }
}
