import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardService } from './dashboard.service';
import { DashboardLayoutModule } from '../../blocks/layout/dashboard-layout/dashboard-layout.module';
// import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashboardLayoutModule,
    // SharedModule,
  ],
  providers: [DashboardService],
})
export class DashboardModule {}
