import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './component/report/report.component';

@NgModule({
  declarations: [ReportComponent],
  imports: [CommonModule, SharedModule, ReportRoutingModule],
})
export class ReportModule {}
