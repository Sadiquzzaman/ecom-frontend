import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [LayoutComponent, SidenavComponent],
  imports: [CommonModule, SharedModule],
  exports: [LayoutComponent],
})
export class DashboardLayoutModule {}
