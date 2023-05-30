import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ImageType } from '../../../../../../../../app/core/enum/image-type.enum';
import { TokenStorageService } from '../../../../../../../../app/core/services/token-storage.service';
import { AuthService } from '../../../../../../../../app/features/auth/auth.service';
import { CreateUserDto } from '../../../../../../../../app/shared/dto/user/create/create-user.dto';
import { UserDto } from '../../../../../../../../app/shared/dto/user/user.dto';
import { ImageSnippetDto } from '../../../../../../../core/dto/image.dto';
import { UserProfileService } from '../../userprofile.service';
import { ResponseService } from '../../../../../../../shared/services/response.service';
import { IPoint } from 'src/app/core/dto/point.dto';

interface Options {
  value: number;
  label: string;
}

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit, AfterViewChecked {
  profileForm!: FormGroup;
  user!: UserDto;
  maxDate = new Date();

  address!: string;
  isFetching = true;
  isSearching = false;
  isLoading = false;
  isSubmitted = false;

  selectedProfileFile!: ImageSnippetDto;
  userProfileImageName!: string;
  isImageChanged = false;

  districtOptions: Array<{ id: string; name: string }> = [];
  districtFiltering: FormControl = new FormControl();
  filteredDistrictOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  thanaOptions: Array<{ id: string; name: string }> = [];
  thanaFiltering: FormControl = new FormControl();
  filteredThanaOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  profileImageType = ImageType.USER_PROFILE;

  /***************** location ****************/
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  location: IPoint = {
    x: 0,
    y: 0,
  };
  zoom = 15;
  private geoCoder: any;

  genders: Options[] = [
    { value: 1, label: 'Male' },
    { value: 2, label: 'Female' },
    { value: 3, label: 'Others' },
  ];

  countryCodes: Options[] = [{ value: +88, label: 'BD (+88)' }];

  constructor(
    private readonly userProfileService: UserProfileService,
    public readonly token: TokenStorageService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly rS: ResponseService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.user = this.route.snapshot?.data?.user;
    // console.log(this.user);
    this.userProfileImageName = this.user?.profile?.profileImageUrl;
  }

  ngOnInit(): void {
    this.getDistricts();
    this.filterDistrict();
    this.getThanasByDistrict(this.user?.address?.district?.id);
    this.filterThana();
    this.initForm();
    this.mapLoader();
  }

  matchPasswordValidator = (control: AbstractControl) => {
    if (control && control.value) {
      const passwordControl = control.root.get('password');
      if (control.value !== passwordControl?.value) {
        return { hasError: true };
      }
    }
    return null;
  };

  hasError = (control: string, error: string) =>
    this.profileForm.controls[control].hasError(error);

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  initForm = () => {
    console.log(this.user);

    // if (this.user.geoLocation) {
    //   this.location = this.user.geoLocation;
    // }

    if (this.token.isMerchant()) {
      console.log('isMerchant');

      this.profileForm = new FormGroup({
        firstName: new FormControl(this.user?.firstName, [Validators.required]),
        lastName: new FormControl(this.user?.lastName, [Validators.required]),
        district: new FormControl(this.user?.address?.district?.id, [
          Validators.required,
        ]),
        thana: new FormControl(this.user?.address?.thana?.id, [
          Validators.required,
        ]),
        addressPlain: new FormControl(this.user?.address?.address, [
          Validators.required,
        ]),
        gender: new FormControl(this.user?.gender, [Validators.required]),
        dateOfBirth: new FormControl(this.user?.dateOfBirth, [
          Validators.required,
        ]),
        license: new FormControl(this.user?.license, [Validators.required]),
        nid: new FormControl(this.user?.nid, [Validators.required]),
        profileImageUrl: new FormControl(this.userProfileImageName, null),
        phone: new FormControl(this.user?.phone, [Validators.required]),
        email: new FormControl(this.user?.email, [Validators.required]),
        location: new FormControl(this.user?.location, Validators.required),
        geoLocation: new FormControl(this.user?.geoLocation),
      });
    } else {
      this.profileForm = new FormGroup({
        firstName: new FormControl(this.user?.firstName, [Validators.required]),
        lastName: new FormControl(this.user?.lastName, [Validators.required]),
        district: new FormControl(this.user?.address?.district?.id, [
          Validators.required,
        ]),
        thana: new FormControl(this.user?.address?.thana?.id, [
          Validators.required,
        ]),
        addressPlain: new FormControl(this.user?.address?.address, [
          Validators.required,
        ]),
        gender: new FormControl(this.user?.gender, [Validators.required]),
        dateOfBirth: new FormControl(this.user?.dateOfBirth, [
          Validators.required,
        ]),
        license: new FormControl(null),
        nid: new FormControl(null),
        profileImageUrl: new FormControl(this.userProfileImageName, null),
        phone: new FormControl(this.user?.phone, [Validators.required]),
        email: new FormControl(this.user?.email, [Validators.required]),
        location: new FormControl(this.user?.location, Validators.required),
        geoLocation: new FormControl(this.user?.geoLocation),
      });
    }
  };

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
            this.profileForm.controls.location.setValue(
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
    this.profileForm.controls.geoLocation.setValue(this.location);
    this.getAddress(this.location.x, this.location.y);
  };

  private setCurrentLocation(): void {
    if (this.user.geoLocation) {
      this.location = this.user.geoLocation;
    } else {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.location.x = position.coords.latitude;
          this.location.y = position.coords.longitude;
          this.profileForm.controls.geoLocation.setValue(this.location);
          // console.log(this.location.x);
          // console.log(this.location.y);
          this.getAddress(this.location.x, this.location.y);
          // console.log(this.profileForm.controls.location.value);
        });
      }
    }
  }

  /***************** location end ****************/

  save = () => {
    if (this.profileForm.valid) this.onSubmit();
  };

  onSubmit = () => {
    const updatedUser = this.profileForm.value;
    console.log(updatedUser);
    if (!this.isSubmitted) {
      this.isSubmitted = true;
      this.userProfileService
        .updateUser(this.token.getUserId(), updatedUser)
        .subscribe(
          (res) => {
            this.isSubmitted = false;
            this.rS.fire(res);
            if (!res.error) {
              this.updateLicenseStatus(res?.payload?.data);

              this.router.navigate(['/dashboard/user/profile']);
            }
            if (this.isImageChanged) {
              this.saveImage(this.userProfileImageName);
            }
          },
          (error) => {
            this.isSubmitted = false;
          }
        );
    }
  };

  goTo = () => {
    if (this.profileForm.valid) {
      this.router.navigate(['/dashboard/user/profile']);
    }
  };

  updateLicenseStatus(user: UserDto) {
    console.log(user);
    if (user && user.license && user.nid) {
      const res = this.token.getUser();
      res.payload.data.hasLicenseAndNID = true;
      this.token.saveUser(res);
    }
  }

  saveImage = (imageName: string) => {
    this.userProfileService.saveProfileImage(imageName).subscribe(
      (res) => {
        this.isSubmitted = false;
        this.router.navigate(['/dashboard/user/profile']);
      },
      (error) => {
        this.isSubmitted = false;
      }
    );
  };

  onDistrictSelect = () => {
    const districtID = this.profileForm.controls.district.value || '';
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

  saveImageToTemp = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedProfileFile = new ImageSnippetDto(event.target.result, file);
      this.userProfileService
        .uploadProfileImageRedis(this.selectedProfileFile.file)
        .subscribe(
          (res) => {
            this.isImageChanged = true;
            this.userProfileImageName = res.filename;
            this.profileForm.controls.profileImageUrl.setValue(
              this.userProfileImageName
            );
          },
          (err) => {
            console.log(err);
          }
        );
    });
    reader.readAsDataURL(file);
  };

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
