import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../shared/services/response.service';
import { AuthService } from '../../auth.service';
import { ChangePasswordDto } from '../../../../shared/dto/user/change-password.dto';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  token: string | null = null;
  resetPasswordForm!: FormGroup;
  passwordVisibility = false;
  confirmPasswordVisibility = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private rS: ResponseService
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
    this.route.paramMap.subscribe((paramMap) => {
      this.token = paramMap.get('token');
    });
    this.initForm();
  }

  initForm = () => {
    this.changePasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [
        Validators.required,
        ResetPasswordComponent.matchValues('newPassword'),
      ]),
    });
  };

  onSubmit = () => {
    if (this.changePasswordForm.valid) {
      const postData = new ChangePasswordDto();
      postData.newPassword = this.changePasswordForm.value.newPassword;
      postData.confirmPassword = this.changePasswordForm.value.confirmPassword;
      postData.token = this.token || '';

      this.authService.changePassword(postData).subscribe(
        (data) => {
          this.rS.fire(data);
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
    }
  };

  goTo = () => {
    // this.router.navigate(['/auth/login']);
    this.router.navigate(['/auth/login'], {
      state: { redirect: this.router.url },
    });
  };
}
