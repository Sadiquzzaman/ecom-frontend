import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../shared/services/response.service';
import { AuthService } from '../../auth.service';
import { OtpDto } from '../../../../shared/dto/user/otp.dto';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements AfterViewInit, OnInit {
  userId: string | null = null;
  @ViewChildren('focus') focusInput!: QueryList<ElementRef>;
  timeLeft = 60 * 5;
  interval: any;
  phoneNumber: string;

  constructor(
    private authService: AuthService,
    private rS: ResponseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.setParam();
  }

  ngOnInit(): void {
    this.loadUser(this.userId);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.focusInput.get(0)?.nativeElement.focus();
      this.startTimer();
    });
  }

  watch(index: number): void {
    this.focusInput.get(index)?.nativeElement.value
      ? this.next(index)
      : this.prev(index);
  }

  next = (index: number) => {
    // eslint-disable-next-line eqeqeq
    if (index == 4) {
      this.submit();
    }
    setTimeout(() => {
      this.focusInput.get(++index)?.nativeElement.focus();
    });
  };

  prev = (index: number) => {
    setTimeout(() => {
      this.focusInput.get(--index)?.nativeElement.focus();
    });
  };

  startTimer = () => {
    clearInterval(this.interval);
    this.timeLeft = 60 * 3;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        // this.timeLeft = 60 * 3;
        clearInterval(this.interval);
      }
    }, 1000);
  };

  resetTimer = () => {
    this.timeLeft = 60 * 3;
    clearInterval(this.interval);
    this.startTimer();
  };

  setParam = () => {
    this.route.paramMap.subscribe((paramMap) => {
      this.userId = paramMap.get('id');
      console.log(this.userId);
    });
  };

  submit = () => {
    this.startTimer();
    let otpRaw = '';
    this.focusInput.forEach((each) => {
      otpRaw += each.nativeElement.value;
    });
    const otpDto = new OtpDto();
    otpDto.otp = Number(otpRaw);

    this.authService.verifyOtp(otpDto.otp, this.userId).subscribe(
      (res) => {
        this.rS.fire(res);
        this.gotoLogin();
      },
      (error) => {
        this.rS.message(error?.error?.message || 'Unexpected Error!');
      }
    );
  };

  resendOtp = () => {
    this.authService.resendOtp(this.userId).subscribe((res) => {
      this.rS.fire(res);
    });
    this.resetTimer();
  };

  gotoLogin = () => {
    // this.router.navigate(['/auth/login']);
    this.router.navigate(['/auth/login']);
  };

  loadUser = (userId: string | null) => {
    this.authService.getUser(userId).subscribe((res) => {
      this.phoneNumber = res.payload?.data?.phone;
    });
  };
}
