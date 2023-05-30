import { StickyDirection } from '@angular/cdk/table';
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { TokenStorageService } from '../../../../../../app/core/services/token-storage.service';
import { AuthService } from '../../../../../../app/features/auth/auth.service';
import { AddressService } from '../../../../../../app/features/site/order/address.service';
import { AddressDto } from '../../../../../../app/shared/dto/core/address.dto';
import { ResponseService } from '../../../../../../app/shared/services/response.service';
import { IPoint } from 'src/app/core/dto/point.dto';
import { MapsAPILoader } from '@agm/core';

interface Options {
  value: number;
  label: string;
}

@Component({
  selector: 'app-shipping-dialog',
  templateUrl: './shipping-dialog.component.html',
  styleUrls: ['./shipping-dialog.component.scss'],
})
export class ShippingDialogComponent implements OnInit {
  shippingAddressForm!: FormGroup;

  isFetching = true;
  isSearching = false;
  isLoading = false;
  isSubmitted = false;
  countryCodes: Options[] = [{ value: +88, label: 'BD (+88)' }];
  editShippingAddressValue: any;
  formSubmitType: boolean;

  districtOptions: Array<{ id: string; name: string }> = [];
  districtFiltering: FormControl = new FormControl();
  filteredDistrictOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  thanaOptions: Array<{ id: string; name: string }> = [];
  thanaFiltering: FormControl = new FormControl();
  filteredThanaOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

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
    public dialogRef: MatDialogRef<ShippingDialogComponent>,
    private authService: AuthService,
    private readonly addressService: AddressService,
    private readonly rS: ResponseService,
    private readonly loaderService: LoaderService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  /***************** location start ****************/
  mapLoader = () => {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );

      console.log(autocomplete);

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
            this.shippingAddressForm.controls.location.setValue(
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
    this.shippingAddressForm.controls.geoLocation.setValue(this.location);
    this.getAddress(this.location.x, this.location.y);
  };

  private setCurrentLocation(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.x = position.coords.latitude;
        this.location.y = position.coords.longitude;
        this.shippingAddressForm.controls.geoLocation.setValue(this.location);
        console.log(this.location.x);
        console.log(this.location.y);
        this.getAddress(this.location.x, this.location.y);
        console.log(this.shippingAddressForm.controls.location.value);
      });
    }
  }

  /***************** location end ****************/

  ngOnInit(): void {
    this.editShippingAddressValue = this.addressService.getShippingAddress();
    this.formSubmitType = this.addressService.formSubmitType();
    this.getThanasByDistrict(this.editShippingAddressValue?.district?.id);
    this.mapLoader();
    this.initForm();
    this.filterDistrict();
    this.filterThana();
    this.getDistricts();
  }

  initForm = () => {
    if (this.formSubmitType) {
      this.shippingAddressForm = new FormGroup({
        alias: new FormControl(null, [Validators.required]),
        firstname: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null, [Validators.required]),
        countryCode: new FormControl(this.countryCodes[0].value, [
          Validators.required,
        ]),
        phone: new FormControl(null, [Validators.required]),
        district: new FormControl(null, [Validators.required]),
        thana: new FormControl(null, [Validators.required]),
        address: new FormControl(null, [Validators.required]),
        location: new FormControl(null, Validators.required),
        geoLocation: new FormControl(null),
      });
    } else {
      console.log(this.editShippingAddressValue);
      this.shippingAddressForm = new FormGroup({
        alias: new FormControl(this.editShippingAddressValue?.alias, [
          Validators.required,
        ]),
        firstname: new FormControl(this.editShippingAddressValue?.firstname, [
          Validators.required,
        ]),
        lastname: new FormControl(this.editShippingAddressValue?.lastname, [
          Validators.required,
        ]),
        countryCode: new FormControl(this.countryCodes[0].value, [
          Validators.required,
        ]),
        phone: new FormControl(this.editShippingAddressValue?.phone, [
          Validators.required,
        ]),
        district: new FormControl(this.editShippingAddressValue?.district?.id, [
          Validators.required,
        ]),
        thana: new FormControl(this.editShippingAddressValue?.thana?.id, [
          Validators.required,
        ]),
        address: new FormControl(this.editShippingAddressValue?.address, [
          Validators.required,
        ]),
        location: new FormControl(this.editShippingAddressValue?.location, [
          Validators.required,
        ]),
        geoLocation: new FormControl(
          this.editShippingAddressValue?.geoLocation,
          [Validators.required]
        ),
      });
    }
  };

  onDistrictSelect = () => {
    const districtID = this.shippingAddressForm.controls.district.value || '';
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.shippingAddressForm.valid) {
      if (this.formSubmitType) {
        const address = this.shippingAddressForm.value as AddressDto;
        this.addressService.addShippingAddress(address).subscribe((res) => {
          if (!res.error) {
            this.rS.fire(res.payload?.data);
            this.loaderService.shippingAddress.next(res.payload?.data);
          }
        });
      } else {
        const updateAddress = this.shippingAddressForm.value as AddressDto;
        this.addressService
          .updateShippingAddress(
            this.editShippingAddressValue.id,
            updateAddress
          )
          .subscribe((res) => {
            if (!res.error) {
              this.rS.fire(res.payload?.data);
              this.loaderService.shippingAddress.next(res.payload?.data);
            }
          });
      }
      this.closeDialog();
    }
  }
}
