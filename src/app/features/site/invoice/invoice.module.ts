import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {InvoiceComponent} from './components/invoice/invoice.component';
import {DashboardLayoutModule} from '../../../blocks/layout/dashboard-layout/dashboard-layout.module';
import {InvoiceService} from './invoice.service';
import {InvoiceRoutingModule} from './invoice-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../../../../environments/environment';

@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    DashboardLayoutModule,
    InvoiceRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_map_api,
      libraries: ['places'],
    }),
  ],
  providers: [InvoiceService, DatePipe]
})
export class InvoiceModule {
}
