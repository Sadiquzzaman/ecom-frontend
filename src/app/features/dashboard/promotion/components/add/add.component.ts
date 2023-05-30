import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, ReplaySubject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ResponseService } from '../../../../../../app/shared/services/response.service';
import { ImageSnippetDto } from '../../../../../../app/core/dto/image.dto';
import { TokenStorageService } from '../../../../../../app/core/services/token-storage.service';
import { PromotionService } from '../../promotion.service';
import { PromotionType } from 'src/app/shared/enum/promotion-type.enum';
import { SystemService } from 'src/app/shared/services/system.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PromotionStatus } from 'src/app/shared/enum/promotion-status.enum';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit, OnDestroy {
  protected _onDestroy = new Subject<void>();

  isShopSearching = false;
  shopFiltering: FormControl = new FormControl();

  shopOptions: Array<{
    id: string;
    name: string;
    // typeId: string;
    // type: string;
  }> = [];

  filteredShopOptions: ReplaySubject<
    {
      id: string;
      name: string;
      // typeId: string;
      // type: string;
    }[]
  > = new ReplaySubject<
    {
      id: string;
      name: string;
      // typeId: string;
      // type: string;
    }[]
  >(1);
  merchant = null;
  isMerchantSearching = false;
  merchantFiltering: FormControl = new FormControl();
  merchantOptions: Array<{ id: string; name: string }> = [];
  filteredMerchantOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  isProductSearching = false;
  productFiltering: FormControl = new FormControl();

  productOptions: Array<{
    id: string;
    name: string;
    // categoryId: string;
    // category: string;
  }> = [];

  filteredProductOptions: ReplaySubject<
    {
      id: string;
      name: string;
      // categoryId: string;
      // category: string;
    }[]
  > = new ReplaySubject<
    {
      id: string;
      name: string;
      // categoryId: string;
      // category: string;
    }[]
  >(1);

  selectedCoverFile!: ImageSnippetDto;
  promotionCoverImageName = '';
  // promotionTypeEnum = PromotionType;
  // selectedPromotionType = '1' as PromotionType;
  promotionForm!: FormGroup;
  minDate = new Date();
  maxDate = new Date();

  minStartDate = new Date();
  isLoading = false;
  isCostShow = false;

  PromotionType = PromotionType;
  promotionTypes: any[] = [];
  bookedDates: any[] = [];

  cost: number;
  dailyCharge: number;
  days: number;
  urlSafe: SafeResourceUrl = '';

  shopID: AbstractControl;
  productID: AbstractControl;
  merchantId: AbstractControl;
  type: AbstractControl;
  startDate: AbstractControl;
  endDate: AbstractControl;
  promotionStatus: AbstractControl;

  constructor(
    public readonly token: TokenStorageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly promotionService: PromotionService,
    private readonly snackBarService: ResponseService,
    private readonly systemService: SystemService,
    private readonly sanitizer: DomSanitizer
  ) {
    if (this.token.isAdmin()) {
      // this.router.navigate(['/dashboard/promotion/add']);
    } else {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
    }

    this.promotionTypes = this.systemService.enumToArray(this.PromotionType, 1);
    this.shopOptions = this.route.snapshot.data?.shops;
    this.filteredShopOptions.next(this.shopOptions);

    // this.productOptions = this.route.snapshot.data?.products;
    // this.filteredProductOptions.next(this.productOptions);
  }

  ngOnInit(): void {
    // this.maxDate.setDate(this.minDate.getDate() + 60);

    this.minDate = this.systemService.addDays(1);
    this.maxDate = this.systemService.addDays(60);
    console.log(this.minDate);
    console.log(this.maxDate);
    if (this.route.snapshot.data?.merchants?.length > 0) {
      this.merchantOptions = this.route.snapshot.data?.merchants;
    } else {
      this.merchantOptions = [];
      this.merchant = this.route.snapshot.data?.merchants?.id;
    }
    console.log(this.route.snapshot.data);

    this.filteredMerchantOptions.next(this.merchantOptions);
    this.formInit();
    this.filterShop();
    this.filterMerchant();
    this.filterProduct();
  }

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe();
  }

  formInit = () => {
    this.promotionForm = new FormGroup({
      shopID: new FormControl(null, Validators.required),
      // shopTypeID: new FormControl(null, Validators.required),
      productID: new FormControl(null, Validators.required),
      // categoryID: new FormControl(null, Validators.required),

      merchantId: new FormControl(
        this.merchant ? this.merchant : null,
        Validators.required
      ),
      type: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      promotionStatus: new FormControl(PromotionStatus.DRAFT, [
        Validators.required,
      ]),
      promotionCoverImage: new FormControl(
        this.promotionCoverImageName,
        Validators.required
      ),
    });

    this.shopID = this.promotionForm.controls.shopID;
    this.productID = this.promotionForm.controls.productID;
    this.merchantId = this.promotionForm.controls.merchantId;
    this.type = this.promotionForm.controls.type;
    this.startDate = this.promotionForm.controls.startDate;
    this.endDate = this.promotionForm.controls.endDate;
    this.promotionStatus = this.promotionForm.controls.promotionStatus;
  };

  setValidation = ($event: any) => {
    // console.log($event);

    if (!$event?.value) {
      return;
    }

    this.shopID.setValue('');
    this.productID.setValue('');

    // this.onDateChange();

    if ($event.value == PromotionType.Shop) {
      this.productID.clearValidators();
    } else {
      this.productID.setValidators([Validators.required]);
    }

    // shopID.updateValueAndValidity();
    this.productID.updateValueAndValidity();
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

  filterShop = () => {
    this.shopFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isShopSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.shopOptions) {
            return [];
          }
          return this.shopOptions.filter(
            (shop) => shop.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isShopSearching = false;
          this.filteredShopOptions.next(filtered);
        },
        () => {
          this.isShopSearching = false;
        }
      );
  };

  filterProduct = () => {
    this.productFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isProductSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.productOptions) {
            return [];
          }
          return this.productOptions.filter(
            (product) =>
              product.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isProductSearching = false;
          this.filteredProductOptions.next(filtered);
        },
        () => {
          this.isProductSearching = false;
        }
      );
  };

  onShopChange(data: any) {
    const selectedShop: any = this.shopOptions.filter(
      (shop) => shop.id === data.value
    );
    if (selectedShop && selectedShop.length > 0) {
      // console.log(selectedShop);
      // this.onDateChange();
      this.productID.setValue(null);
      this.getProducts(selectedShop[0].id);
    }
    const type = this.type.value;
    if (type && type != PromotionType.Product) {
      this.availableSlots();
    }
  }

  getProducts = (shopID: string) => {
    this.promotionService
      .getProductsByShopId(shopID, 1, 2000)
      .subscribe((res: any) => {
        this.productOptions = res;
        this.filteredProductOptions.next(this.productOptions);
      });
  };

  onMerchantChange(data: any) {
    const selectedMerchant: any = this.merchantOptions.filter(
      (merchant) => merchant.id === data.value
    );
    if (selectedMerchant && selectedMerchant.length > 0) {
      // console.log(selectedMerchant);
      this.shopID.setValue('');
      this.productID.setValue('');
      this.getShops(selectedMerchant[0].id);
    }
  }

  getShops = (merchantId: string) => {
    this.promotionService
      .getShopByMerchantId(merchantId)
      .subscribe((res: any) => {
        this.shopOptions = res;
        this.filteredShopOptions.next(this.shopOptions);
      });
  };

  onProductChange(data: any) {
    const productID = data.value;
    const type = this.type.value;
    if (productID && type && type == PromotionType.Product) {
      this.availableSlots();
    }
  }

  //

  availableSlots = () => {
    const shopId = this.shopID.value;
    const productId = this.productID.value;
    const promotionType = this.type.value;

    if (promotionType) {
      this.startDate.setValue('');
      this.endDate.setValue('');

      this.onDateChange();
      this.bookedDates = [];
      this.promotionService
        .bookingSlots(promotionType, shopId, productId)
        .subscribe((res) => {
          // console.log(res);
          let bookedDates: [] = res.booked;
          if (bookedDates.length) {
            this.bookedDates = bookedDates.map((ele) => new Date(ele));
            console.log(this.bookedDates);
          }
        });
    }
  };

  bookedDayFilter = (d: Date | null): boolean => {
    const dates = (d || new Date()).getDate();
    return !this.bookedDates.find((x) => x.getDate() == dates);
  };

  onStartDateChange(data: any) {
    this.minStartDate = data.value;
    this.endDate.setValue('');
    this.onDateChange();
  }

  onDateChange = () => {
    this.promotionStatus.setValue(PromotionStatus.DRAFT);
    this.isCostShow = false;
  };

  changeStatus = ($event: any) => {
    const shopID = this.shopID.value;
    const productID = this.productID.value;
    const type = this.type.value;
    const startDate = this.startDate.value;
    const endDate = this.endDate.value;

    if (type && startDate && endDate) {
      this.isLoading = true;
      this.promotionService
        .slotCost(type, shopID, productID, startDate, endDate)
        .subscribe(
          (res) => {
            // console.log(res);
            this.cost = res.cost;
            this.dailyCharge = res.dailyCharge;
            this.days = res.days;
            this.isLoading = false;
            this.isCostShow = true;
          },
          () => {
            this.isLoading = false;
            this.isCostShow = false;
          }
        );
    }
  };

  save() {
    if (this.promotionForm.valid) {
      this.saveData();
    } else {
      console.log(this.promotionForm.value);
      console.log(this.promotionForm);
    }
  }

  saveData() {
    this.isLoading = true;
    const promotion = this.promotionForm.value;

    promotion.type = parseInt(promotion.type, 10);
    this.promotionService.create(promotion).subscribe((response: any) => {
      this.isLoading = false;
      if (this.snackBarService.fire(response)) {
        Promise.all([this.savePromotionImage(promotion.type)]).then(() => {
          let data = response?.payload?.data;
          if (this.promotionStatus.value == PromotionStatus.CONFIRMED) {
            let url = data?.paymentUrl?.GatewayPageURL;
            if (url) {
              // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
              window.location.href = url;
            } else {
              this.redirectList();
            }
          } else {
            this.redirectList();
          }
        });
      }
    });
  }

  redirectList = () => {
    this.promotionForm.reset();
    this.router.navigate(['/dashboard/promotion/list']);
  };

  savePromotionImage = (type: number) => {
    this.promotionService
      .uploadCoverImage(this.promotionCoverImageName, type)
      .subscribe(() => {
        console.log('Profile image uploaded to server successfully');
      });
    return true;
  };

  waitForCoverImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedCoverFile = new ImageSnippetDto(event.target.result, file);
      this.promotionService
        .uploadCoverImageRedis(this.selectedCoverFile.file)
        .subscribe(
          (res) => {
            console.log(res);
            this.promotionCoverImageName = res.filename;
            this.promotionForm.controls.promotionCoverImage.setValue(
              this.promotionCoverImageName
            );
          },
          (err) => {
            console.log(err);
          }
        );
    });
    reader.readAsDataURL(file);
  };
}
