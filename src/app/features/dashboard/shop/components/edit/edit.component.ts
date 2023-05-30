import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../../shared/services/response.service';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ShopService } from '../../shop.service';
import { IPoint } from '../../../../../core/dto/point.dto';
import { ImageSnippetDto } from '../../../../../core/dto/image.dto';
import { MapsAPILoader } from '@agm/core';
import { TokenStorageService } from '../../../../../../app/core/services/token-storage.service';
import { ImageType } from 'src/app/core/enum/image-type.enum';
import { ImageService } from 'src/app/shared/services/image.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  editShopForm!: FormGroup;
  isLoading = false;
  btnLabel = 'Update';
  id = '';

  isMerchantSearching = false;
  merchantFiltering: FormControl = new FormControl();
  merchantOptions: Array<{ id: string; name: string }> = [];
  filteredMerchantOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  isShopManagerSearching = false;
  shopManagerFiltering: FormControl = new FormControl();
  shopManagerOptions: Array<{ id: string; name: string }> = [];
  filteredShopManagerOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  isTypeSearching = false;
  typeFiltering: FormControl = new FormControl();
  typeOptions: Array<{ id: string; name: string }> = [];
  filteredTypeOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);
  /***************** location ****************/
  @ViewChild('search')
  public searchElementRef!: ElementRef;

  /**************** image *******************/
  selectedCoverFile!: ImageSnippetDto;
  shopCoverImageName = '';
  selectedProfileFile!: ImageSnippetDto;
  shopProfileImageName = '';
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly shopService: ShopService,
    private readonly snackBarService: ResponseService,
    private route: ActivatedRoute,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public readonly token: TokenStorageService,
    private readonly imageService: ImageService
  ) {
    if (!this.token.isAdmin()) {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
    }
  }

  ngOnInit(): void {
    if (this.route.snapshot.data?.merchants?.length > 0) {
      this.merchantOptions = this.route.snapshot.data?.merchants;
    } else {
      this.merchantOptions = [];
    }
    this.filteredMerchantOptions.next(this.merchantOptions);

    if (this.route.snapshot.data?.shopManagers?.length > 0) {
      this.shopManagerOptions = this.route.snapshot.data?.shopManagers;
    } else {
      this.shopManagerOptions = [];
    }
    this.filteredShopManagerOptions.next(this.shopManagerOptions);

    this.typeOptions = this.route.snapshot.data?.types;
    this.filteredTypeOptions.next(this.typeOptions);
    this.formInit(this.route.snapshot.data?.shop);
    this.loadImage(this.route.snapshot.data?.shop);
    this.filterShopManager();
    this.filterMerchant();
    this.filterType();
    this.mapLoader();
    this.disableShopType();
  }

  /***************** google map start ****************/
  private geoCoder: any;
  location: IPoint = {
    x: 0,
    y: 0,
  };
  zoom = 15;

  mapLoader = () => {
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
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
          if (results[0]) {
            this.editShopForm.controls.location.setValue(
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
    this.editShopForm.controls.geoLocation.setValue(this.location);
    this.getAddress(this.location.x, this.location.y);
  };

  private setCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.x = position.coords.latitude;
        this.location.y = position.coords.longitude;
        this.editShopForm.controls.geoLocation.setValue(this.location);
        this.getAddress(this.location.x, this.location.y);
      });
    }
  }

  /***************** google map end ****************/

  formInit = (shop: any) => {
    console.log(shop);
    let shopManagerId = null;
    if (shop?.shopManagers.length) {
      shopManagerId = shop?.shopManagers[0]['id'];
    }
    this.id = shop.id;
    this.location = shop.geoLocation;
    this.editShopForm = new FormGroup({
      name: new FormControl(shop.name, Validators.required),
      domain: new FormControl(shop.domain, Validators.required),
      url: new FormControl(shop.url, [
        Validators.required,
        Validators.pattern(
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
        ),
      ]),
      location: new FormControl(shop.location, Validators.required),
      geoLocation: new FormControl(shop.geoLocation),
      shopTypeID: new FormControl(shop.shopType?.id, Validators.required),
      merchantID: new FormControl(shop?.merchant?.id, Validators.required),
      shopManagerId: new FormControl(shopManagerId),
      shopCoverImage: new FormControl(
        shop?.shopCoverImage,
        Validators.required
      ),
      shopProfileImage: new FormControl(
        shop?.shopProfileImage,
        Validators.required
      ),
      description: new FormControl(shop.description, Validators.required),
    });
  };

  disableShopType = () => {
    if (this.route?.snapshot?.data?.shop.isApproved == 1) {
      if (this.token.isAdmin()) {
        this.editShopForm.controls['shopTypeID'].enable();
      } else {
        this.editShopForm.controls['shopTypeID'].disable();
      }
    }
  };

  filterShopManager = () => {
    this.shopManagerFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isShopManagerSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.shopManagerOptions) {
            return [];
          }
          return this.shopManagerOptions.filter(
            (shopManager) =>
              shopManager.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isShopManagerSearching = false;
          this.filteredShopManagerOptions.next(filtered);
        },
        () => {
          this.isShopManagerSearching = false;
        }
      );
  };

  filterMerchant = () => {
    this.merchantFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isMerchantSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.merchantOptions) {
            return [];
          }
          return this.merchantOptions.filter(
            (merchant) =>
              merchant.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isMerchantSearching = false;
          this.filteredMerchantOptions.next(filtered);
        },
        () => {
          this.isMerchantSearching = false;
        }
      );
  };

  filterType = () => {
    this.typeFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isTypeSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.typeOptions) {
            return [];
          }
          return this.typeOptions.filter(
            (type) => type.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isTypeSearching = false;
          this.filteredTypeOptions.next(filtered);
        },
        () => {
          this.isTypeSearching = false;
        }
      );
  };

  loadImage = (shop: any): void => {
    this.shopCoverImageName = shop?.shopCoverImage;
    this.shopProfileImageName = shop?.shopProfileImage;

    if (
      shop?.shopCoverImage.includes('http:') ||
      shop?.shopCoverImage.includes('assets')
    ) {
      this.selectedCoverFile = new ImageSnippetDto(
        shop?.shopCoverImage,
        new File(['fake'], 'fake.txt')
      );
    } else {
      this.selectedCoverFile = new ImageSnippetDto(
        this.imageService.loadImage(shop?.shopCoverImage, ImageType.SHOP_COVER),
        new File(['fake'], 'fake.txt')
      );
    }

    if (
      shop?.shopProfileImage.includes('http:') ||
      shop?.shopProfileImage.includes('assets')
    ) {
      this.selectedProfileFile = new ImageSnippetDto(
        shop?.shopProfileImage,
        new File(['fake'], 'fake.txt')
      );
    } else {
      this.selectedProfileFile = new ImageSnippetDto(
        this.imageService.loadImage(
          shop?.shopProfileImage,
          ImageType.SHOP_PROFILE_SMALL
        ),
        new File(['fake'], 'fake.txt')
      );
    }

    // for (const imageName of this.productImages.gallery) {
    //   if (imageName.includes('http:') || imageName.includes('assets')) {
    //     this.selectedProductGallery.push(
    //       new ImageSnippetDto(imageName, new File(['fake'], 'fake.txt'))
    //     );
    //   } else {
    //     this.selectedProductGallery.push(
    //       new ImageSnippetDto(
    //         this.imageService.loadImage(imageName, ImageType.PRODUCT_SMALL),
    //         new File(['fake'], 'fake.txt')
    //       )
    //     );
    //   }
    // }
  };

  save = () => {
    console.log(this.editShopForm.value);
    if (this.editShopForm.valid) {
      this.saveData();
    }
  };

  saveData = () => {
    this.isLoading = true;
    console.log(this.editShopForm.value);
    this.shopService.update(this.id, this.editShopForm.value).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          Promise.all([this.saveCoverImage(), this.saveProfileImage()]).then(
            (x) => {
              console.log(x);
              this.editShopForm.reset();
              this.router.navigate(['/dashboard/shop/list']);
            }
          );
        } else {
          this.btnLabel = 'Try Again!';
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  };

  saveCoverImage = () => {
    this.shopService.uploadCoverImage(this.shopCoverImageName).subscribe(() => {
      console.log('Cover image uploaded to server successfully');
    });
    return true;
  };

  saveProfileImage = () => {
    this.shopService
      .uploadProfileImage(this.shopProfileImageName)
      .subscribe(() => {
        console.log('Profile image uploaded to server successfully');
      });
    return true;
  };

  /********************** image ************************/
  waitForCoverImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedCoverFile = new ImageSnippetDto(event.target.result, file);
      this.shopService
        .uploadCoverImageRedis(this.selectedCoverFile.file)
        .subscribe(
          (res) => {
            this.shopCoverImageName = res.filename;
            this.editShopForm.controls.shopCoverImage.setValue(
              this.shopCoverImageName
            );
          },
          (err) => {
            console.log(err);
          }
        );
    });
    reader.readAsDataURL(file);
  };

  waitForProfileImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedProfileFile = new ImageSnippetDto(event.target.result, file);
      this.shopService
        .uploadProfileImageRedis(this.selectedProfileFile.file)
        .subscribe(
          (res) => {
            this.shopProfileImageName = res.filename;
            this.editShopForm.controls.shopProfileImage.setValue(
              this.shopProfileImageName
            );
          },
          (err) => {
            console.log(err);
          }
        );
    });
    reader.readAsDataURL(file);
  };

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
