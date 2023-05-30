import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { LoginComponent } from './component/login/login.component';
import { OtpComponent } from './component/otp/otp.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './component/forget-password/forget-password.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { RegisterComponent } from './component/register/register.component';

const routes: Routes = [
  { path: 'registration', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'otp/:id', component: OtpComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'change-password/:token', component: ResetPasswordComponent },
  { path: 'reset-password/:token', component: ChangePasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
