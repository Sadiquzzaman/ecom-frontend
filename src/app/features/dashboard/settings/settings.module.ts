import { SettingsRoutingModule } from './contact-us-routing.module';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, SharedModule, SettingsRoutingModule],
})
export class SettingsModule {}
