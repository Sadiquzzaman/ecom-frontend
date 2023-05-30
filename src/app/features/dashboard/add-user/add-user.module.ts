import { AddUserService } from './add-user.service';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserRoutingModule } from './add-user-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [AddUserComponent],
  imports: [
    CommonModule,
    SharedModule,
    AddUserRoutingModule,
    NgxCaptchaModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_map_api,
      libraries: ['places'],
    }),
  ],
  providers: [AddUserService],
})
export class AddUserModule {}
