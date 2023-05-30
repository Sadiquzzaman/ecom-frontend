import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutComponent } from './layout/layout.component';
import { FacebookChatComponent } from './facebook-chat/facebook-chat.component';
import { FacebookModule } from 'ngx-facebook';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FacebookModule.forRoot(),
    // MatButtonToggleModule,
    // MatTooltipModule,
  ],
  declarations: [
    LayoutComponent,
    FacebookChatComponent
  ],
  exports: [
    LayoutComponent,
    // FacebookChatComponent,
    SharedModule,
  ],
})
export class SiteLayoutModule {}
