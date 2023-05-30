import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { ResponseService } from '../../../../shared/services/response.service';
import { AuthService } from '../../auth.service';
import { LoginDto } from '../../../../shared/dto/user/login.dto';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { CartService } from 'src/app/features/site/cart/cart.service';
import { tap, concatMap } from 'rxjs/operators';
import { CartInterface } from 'src/app/shared/interfaces/cart.interface';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface SelectOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  passwordVisibility = false;
  isKeepLogin = 0;
  brewOptions: SelectOption[];
  selectControl = new FormControl();
  user: SocialUser;
  loggedIn: boolean;

  cart: CartInterface[] | any[];
  cartInfo: any = {};
  cartInfoDetails: any[] = [];
  userData: any;
  socialLogin: Subscription = new Subscription();
  initialState: boolean;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private rS: ResponseService,
    private socialAuthService: SocialAuthService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.initialState = true;
    this.clearAll();
    this.socialAuthState();
    this.initForm();
  }

  clearAll = async () => {
    this.tokenStorage.removeToken();
    this.tokenStorage.removeUser();
    window.localStorage.clear();
    this.shoppingCartService.clearAllKey();
    // await this.signOut();
    // await this.refreshToken();
  };

  async signOut() {
    await this.socialAuthService.signOut();
  }

  async signInWithGoogle() {
    this.initialState = false;
    await this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((res) => {
        // console.log(res);
      })
      .catch((error) => {
        // console.log(error);
      });

    // this.socialAuthState();
  }

  async signInWithFacebook() {
    this.initialState = false;
    await this.socialAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });

    // this.socialAuthState();
  }

  socialAuthState = () => {
    this.socialLogin = this.socialAuthService.authState.subscribe(
      async (user: any) => {
        console.log(user);

        if (!user || !user.email) {
          return;
        }

        if (this.initialState) {
          await this.signOut();
          return;
        }

        if (user?.provider == 'GOOGLE') {
          this.authService
            .googleLogin({ idToken: user?.response?.id_token })
            .subscribe(
              (data) => {
                console.log(data);
                this.loggedSuccess(data);
              },
              (err: any) => {
                this.loggedError(err);
              }
            );
        } else if (user?.provider == 'FACEBOOK') {
          // this.userData = {
          //   email: user?.email,
          //   firstName: user?.firstName,
          //   lastName: user?.lastName,
          //   fullName: user?.name,
          //   profileImageUrl: user?.photoUrl,
          // };
          // console.log(this.userData);
          // this.authService.facebookLogin(this.userData).subscribe((res: any) => {
          //   console.log(res);
          //   this.setUser(res);
          // });
          this.authService
            .facebookLogin({ idToken: user?.authToken })
            .subscribe(
              (data) => {
                console.log(data);
                this.loggedSuccess(data);
              },
              (err: any) => {
                this.loggedError(err);
              }
            );
        }
      }
    );
  };

  onSubmit = () => {
    if (this.loginForm.valid) {
      const dataForSubmit = new LoginDto();
      dataForSubmit.phone = this.loginForm.value.phoneOrEmail;
      dataForSubmit.email = this.loginForm.value.phoneOrEmail;
      dataForSubmit.password = this.loginForm.value.password;
      dataForSubmit.isChecked = this.isKeepLogin;

      this.authService.login(dataForSubmit).subscribe(
        (data) => {
          console.log(data);
          this.loggedSuccess(data);
        },
        (err: any) => {
          this.loggedError(err);
        }
      );
    }
  };

  loggedSuccess = (data: any) => {
    this.rS.fire(data);
    if (!data.error) {
      this.tokenStorage.saveToken(data?.payload?.data.accessToken);
      this.tokenStorage.saveUser(data);
      this.shoppingCartService.getCartDetails();
      // this.loadCurrentCart();
      this.goTo();
    }
  };

  loggedError = (err: any) => {
    if (err.error instanceof ProgressEvent) {
      this.rS.message(err.message);
    } else {
      this.rS.fire(err.error || err);
    }
  };

  setUser = (user: any) => {
    // console.log(user.response.id_token);
    this.user = user;
    // console.log(user);
    this.loggedIn = user != null;
  };

  async refreshToken(): Promise<void> {
    await this.socialAuthService.refreshAuthToken(
      GoogleLoginProvider.PROVIDER_ID
    );
    await this.socialAuthService.refreshAuthToken(
      FacebookLoginProvider.PROVIDER_ID
    );
  }

  initForm = () => {
    this.loginForm = new FormGroup({
      phoneOrEmail: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  };

  changeCheckBox(event: any): void {
    if (event === true) {
      this.isKeepLogin = 1;
    } else {
      this.isKeepLogin = 0;
    }
  }

  goTo = () => {
    const { redirect } = window.history.state;
    console.log(this.tokenStorage.getUser().payload?.data);

    if (this.tokenStorage.isOnlyCustomer()) {
      // this.redirectTo('/dashboard');
      this.router.navigateByUrl(redirect || '/');
      // this.router.navigate(['/']);
    } else {
      //this.router.navigateByUrl(redirect || '/dashboard');
      this.router.navigate(['/dashboard']);
    }
  };

  redirectTo(uri: string) {
    if (this.router.url == uri) {
      this.router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => this.router.navigate([uri]));
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.socialLogin.unsubscribe();
  }
}
