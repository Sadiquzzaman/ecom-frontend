import { TokenStorageService } from './../../../../core/services/token-storage.service';
import { ResponseService } from './../../../../shared/services/response.service';
import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordDto } from '../../../../shared/dto/user/reset-password.dto';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  newPasswordVisibility = false;
  presentPasswordVisibility = false;
  confirmPasswordVisibility = false;
  tokenId: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly rS: ResponseService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly token: TokenStorageService
  ) {}

  public static matchValues(
    matchTo: string
  ): (arg0: AbstractControl) => ValidationErrors | null {
    return (control: any): ValidationErrors | null =>
      !!control.parent &&
      !!control.parent.value &&
      control.value === control?.parent?.controls[matchTo].value
        ? null
        : { isMatching: false };
  }

  ngOnInit(): void {
    this.tokenId = this.token.getUserId();
    this.initForm();
  }

  initForm = () => {
    this.changePasswordForm = new FormGroup({
      presentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern('^.{8,}$'),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        ChangePasswordComponent.matchValues('newPassword'),
      ]),
    });
  };

  hasError = (control: string, error: string) => {
    return this.changePasswordForm.controls[control].hasError(error);
  };

  submit = () => {
    if (this.changePasswordForm.valid) {
      const postData = new ResetPasswordDto();
      postData.presentPassword = this.changePasswordForm.value.presentPassword;
      postData.newPassword = this.changePasswordForm.value.newPassword;
      postData.confirmPassword = this.changePasswordForm.value.confirmPassword;
      // postData.token = this.tokenId || '';
      console.log(postData);

      this.authService.resetPassword(postData).subscribe(
        (res) => {
          this.rS.fire(res);
          this.goTo();
        },
        (err: any) => {
          if (err.error instanceof ProgressEvent) {
            this.rS.message(err.message);
          } else {
            this.rS.fire(err.error || err);
          }
        }
      );
    } else {
      this.rS.message('Fill up all required fields!');
    }
  };

  goTo = () => {
    if (this.changePasswordForm.valid) {
      // this.router.navigate(['/auth/login']);
      this.router.navigate(['/auth/login'], {
        state: { redirect: this.router.url },
      });
    }
  };
}
