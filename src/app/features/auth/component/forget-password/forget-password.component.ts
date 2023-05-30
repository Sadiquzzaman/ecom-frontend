import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { ResponseService } from '../../../../shared/services/response.service';
import { AuthService } from '../../auth.service';
import { PhoneOrEmailDto } from '../../../../shared/dto/user/phone-or-email.dto';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private rS: ResponseService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.forgetPasswordForm = new FormGroup({
      phoneOrEmail: new FormControl(null, [Validators.required]),
    });
  };

  onSubmit = () => {
    if (this.forgetPasswordForm.valid) {
      const postData = new PhoneOrEmailDto();
      postData.phoneOrEmail = this.forgetPasswordForm.value.phoneOrEmail;

      this.authService.forgetPassword(postData).subscribe(
        (data) => {
          this.rS.fire(data);
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
    this.router.navigate(['/auth/otp']);
  };
}
