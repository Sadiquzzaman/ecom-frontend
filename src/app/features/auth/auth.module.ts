import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginComponent } from './component/login/login.component';
import { OtpComponent } from './component/otp/otp.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AuthLayoutModule } from '../../blocks/layout/auth-layout/auth-layout.module';
import { AuthService } from './auth.service';
import { ForgetPasswordComponent } from './component/forget-password/forget-password.component';
import { RegisterComponent } from './component/register/register.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialAuthServiceConfig,
  SocialLoginModule
} from 'angularx-social-login';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { CartService } from '../site/cart/cart.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    OtpComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    AuthLayoutModule,
    AuthRoutingModule,
    NgxCaptchaModule,
    SocialLoginModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_map_api,
      libraries: ['places'],
    }),
  ],
  providers: [
    AuthService,
    ShoppingCartService,
    CartService,
    TokenStorageService,
    SocialAuthService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.facebook_app_id),
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.google_client_id),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
})
export class AuthModule {}
