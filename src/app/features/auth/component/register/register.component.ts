import { ShoppingCartService } from './../../../../shared/services/shopping-cart.service';
import {
  Component,
  OnDestroy,
  OnInit,
  NgZone,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { ResponseDto } from '../../../../shared/dto/reponse/response.dto';
import { ResponseService } from '../../../../shared/services/response.service';
import { AuthService } from '../../auth.service';
import { IPoint } from 'src/app/core/dto/point.dto';
import { MapsAPILoader } from '@agm/core';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from 'angularx-social-login';

interface Options {
  value: number;
  label: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  genders: Options[] = [
    { value: 1, label: 'Male' },
    { value: 2, label: 'Female' },
    { value: 3, label: 'Unknown' },
  ];

  countryCodes: Options[] = [{ value: +88, label: 'BD (+88)' }];

  address!: string;
  isLoading = false;
  isSubmitted = false;
  registrationForm!: FormGroup;
  passwordVisibility = false;
  confirmPasswordVisibility = false;
  maxDate = new Date();
  registrationType!: string | null;
  registrationTypeText!: string | null;

  isSearching = false;
  isFetching = true;

  districtOptions: Array<{ id: string; name: string }> = [];
  districtFiltering: FormControl = new FormControl();
  filteredDistrictOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  thanaOptions: Array<{ id: string; name: string }> = [];
  thanaFiltering: FormControl = new FormControl();
  filteredThanaOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  socialLogin: Subscription = new Subscription();
  initialState: boolean;
  stateText = 'Sign up with Email';
  stateTextBool = true;
  stateTextType = 'Register as Merchant';
  stateTextTypeBool = true;

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  /***************** location ****************/
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  location: IPoint = {
    x: 0,
    y: 0,
  };
  zoom = 15;
  private geoCoder: any;

  constructor(
    private authService: AuthService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly rS: ResponseService,
    private tokenStorageService: TokenStorageService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private socialAuthService: SocialAuthService,
    private readonly shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.registrationType = params.get('type');
      if (this.registrationType) {
        this.registrationTypeText = 'merchant';
      } else {
        this.registrationType = 'Customer';
      }

      console.log(this.registrationType);
      this.initForm();
      this.filterDistrict();
      this.filterThana();
      this.getDistricts();
      this.mapLoader();
    });
  }

  /***************** location start ****************/
  mapLoader = () => {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );

      // console.log(autocomplete);

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.location.x = place.geometry.location.lat();
          this.location.y = place.geometry.location.lng();
        });
      });
    });
  };

  getAddress(latitude: any, longitude: any): void {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          console.log(results);
          if (results[0]) {
            this.registrationForm.controls.location.setValue(
              results[0].formatted_address
            );
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  addMarker = (lat: number, lng: number) => {
    this.location.x = lat;
    this.location.y = lng;
    console.log(this.location.x);
    console.log(this.location.y);
    this.registrationForm.controls.geoLocation.setValue(this.location);
    this.getAddress(this.location.x, this.location.y);
  };

  private setCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.x = position.coords.latitude;
        this.location.y = position.coords.longitude;
        this.registrationForm.controls.geoLocation.setValue(this.location);
        // console.log(this.location.x);
        // console.log(this.location.y);
        this.getAddress(this.location.x, this.location.y);
        // console.log(this.registrationForm.controls.location.value);
      });
    }
  }

  /***************** location end ****************/

  initForm = () => {
    this.registrationForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      countryCode: new FormControl(this.countryCodes[0].value, [
        Validators.required,
      ]),
      phone: new FormControl(null),
      email: new FormControl(null, [Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern('^.{8,}$'),
        // Validators.pattern(
        //   '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        // ),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        this.matchPasswordValidator,
      ]),
      // district: new FormControl(null, [Validators.required]),
      // thana: new FormControl(null, [Validators.required]),
      // addressPlain: new FormControl(null, [Validators.required]),
      captcha: new FormControl(null),
      // location: new FormControl(null, [Validators.required]),
      // geoLocation: new FormControl(null, [Validators.required]),
    });
  };

  hasError = (control: string, error: string) =>
    this.registrationForm.controls[control].hasError(error);

  getDistricts = () => {
    {
      this.authService.getIdsAndNamesDistricts().subscribe((res) => {
        this.districtOptions = res;
        this.filteredDistrictOptions.next(this.districtOptions);
        this.isFetching = false;
      });
    }
  };

  filterDistrict = () => {
    this.districtFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.districtOptions) {
            return [];
          }
          return this.districtOptions.filter(
            (district) =>
              district?.name?.toLowerCase().indexOf(search?.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isSearching = false;
          this.filteredDistrictOptions.next(filtered);
        },
        () => {
          this.isSearching = false;
        }
      );
  };

  filterThana = () => {
    this.thanaFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.thanaOptions) {
            return [];
          }
          return this.thanaOptions.filter(
            (thana) =>
              thana?.name?.toLowerCase().indexOf(search?.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isSearching = false;
          this.filteredThanaOptions.next(filtered);
        },
        () => {
          this.isSearching = false;
        }
      );
  };

  onDistrictSelect = () => {
    const districtID = this.registrationForm.controls.district.value || '';
    this.getThanasByDistrict(districtID);
  };

  getThanasByDistrict = (districtID: string = '') => {
    this.authService
      .getIdsAndNamesThanasByDistrict(districtID)
      .subscribe((res) => {
        this.thanaOptions = res;
        this.filteredThanaOptions.next(this.thanaOptions);
        this.isFetching = false;
      });
  };

  matchPasswordValidator = (control: AbstractControl) => {
    if (control && control.value) {
      const passwordControl = control.root.get('password');
      if (control.value !== passwordControl?.value) {
        return { hasError: true };
      }
    }
    return null;
  };

  gotoOtp = (userId: string) => {
    this.router.navigate(['/auth/otp/' + userId]);
  };

  register = () => {
    console.log(this.registrationForm.value);

    if (this.registrationForm.valid) {
      this.isSubmitted = true;
      const userDto = this.registrationForm.value;
      delete userDto.countryCode;
      delete userDto.confirmPassword;
      // eslint-disable-next-line eqeqeq
      if (this.registrationType == 'merchant') {
        userDto.type = 4;
      } else if (this.registrationType == 'transporter') {
        userDto.type = 7;
      } else if (this.registrationType == 'employee') {
        userDto.type = 5;
      } else if (this.registrationType == 'admin') {
        userDto.type = 2;
      } else if (this.registrationType == 'shop_manager') {
        userDto.type = 9;
      } else {
        userDto.type = 3;
      }

      if (
        this.registrationForm.controls.phone.value ||
        this.registrationForm.controls.email.value
      ) {
        this.authService.register(userDto).subscribe(
          (response: ResponseDto) => {
            this.rS.fire(response);
            if (!response.error) {
              const userId = response.payload?.data.id;

              if (userId) {
                this.tokenStorageService.saveUser(response);
                this.gotoOtp(userId);
              }
            }
          },
          (err: any) => {
            this.rS.fire(err);
            this.isSubmitted = false;
          }
        );
      } else {
        if (!this.registrationForm.controls.captcha.valid) {
          this.rS.message('Invalid captcha');
        } else if (
          !this.registrationForm.controls.phone.value &&
          !this.registrationForm.controls.email.value
        ) {
          this.rS.message('Please Fill up one of phone or email', true);
        } else {
          this.rS.message('Fill up all required fields!');
        }
      }
    }
  };

  goTo = () => {
    const { redirect } = window.history.state;
    console.log(this.tokenStorageService.getUser().payload?.data);

    if (this.tokenStorageService.isOnlyCustomer()) {
      // this.redirectTo('/dashboard');
      this.router.navigateByUrl(redirect || '/');
      // this.router.navigate(['/']);
    } else {
      //this.router.navigateByUrl(redirect || '/dashboard');
      this.router.navigate(['/dashboard']);
    }
  };

  loggedSuccess = (data: any) => {
    this.rS.fire(data);
    if (!data.error) {
      this.tokenStorageService.saveToken(data?.payload?.data.accessToken);
      this.tokenStorageService.saveUser(data);
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

  onChangeText = () => {
    this.stateTextBool = !this.stateTextBool;
    if (this.stateTextBool === true) {
      this.stateText = 'Sign up with Email';
    } else {
      this.stateText = 'Sign up with Mobile';
    }
  };

  onChangeTextType = () => {
    this.stateTextTypeBool = !this.stateTextTypeBool;
    if (this.stateTextTypeBool === true) {
      this.stateTextType = 'Register as Merchant';
    } else {
      this.stateTextType = 'Register as Customer';
    }
  };

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
