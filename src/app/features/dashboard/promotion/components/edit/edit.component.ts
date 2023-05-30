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
import { ImageService } from 'src/app/shared/services/image.service';
import { ImageType } from 'src/app/core/enum/image-type.enum';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
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
  minDate: Date;
  maxDate: Date;
  minStartDate: Date;
  isLoading = false;
  isCostShow = false;

  PromotionType = PromotionType;
  pStatus = PromotionStatus;
  promotionTypes: any[] = [];
  promotionStatusArray: any[];
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
  initialStatus: any;
  processPayment: boolean = false;
  id: string = '';
  promotionCoverImage: any;
  responsePromotion: any;
  isImageUploadedRedis: boolean = false;

  constructor(
    public readonly token: TokenStorageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly promotionService: PromotionService,
    private readonly snackBarService: ResponseService,
    private readonly systemService: SystemService,
    private readonly imageService: ImageService,
    private readonly sanitizer: DomSanitizer
  ) {
    if (this.token.isAdmin()) {
      // this.router.navigate(['/dashboard/promotion/add']);
    } else {
      // this.token.isMerchant
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
    }

    this.promotionTypes = this.systemService.enumToArray(this.PromotionType, 1);
    this.promotionStatusArray = this.systemService.enumToArray(this.pStatus, 1);

    // this.productOptions = this.route.snapshot.data?.products;
    // this.filteredProductOptions.next(this.productOptions);
  }

  ngOnInit(): void {
    // this.maxDate.setDate(this.minDate.getDate() + 60);
    // console.log(this.promotionStatusArray);
    // console.log(this.pStatus['DRAFT']);

    // console.log(this.minDate);
    // console.log(this.maxDate);
    // if (this.route.snapshot.data?.merchants?.length > 0) {
    //   this.merchantOptions = this.route.snapshot.data?.merchants;
    // } else {
    //   this.merchantOptions = [];
    //   this.merchant = this.route.snapshot.data?.merchants?.id;
    // }

    let promotion = this.route.snapshot?.data?.promotion;
    this.responsePromotion = promotion;
    this.merchant = promotion?.merchant?.id;
    this.formInit(promotion);
    this.initialStatus = promotion.promotionStatus;

    this.minDate = this.systemService.addDays(-90);
    this.maxDate = this.systemService.addDays(90);
    if (this.initialStatus == PromotionStatus.DRAFT) {
      this.minDate = this.systemService.addDays(1);
      this.maxDate = this.systemService.addDays(60);
    }
    this.minStartDate = this.minDate;
    // this.selectedPromotionType = this.route.snapshot?.data?.promotion.type;

    let shopID = promotion?.shop?.id;
    this.getProducts(shopID);

    if (this.token.isAdmin()) {
      this.promotionService.getShopByShopId(shopID).subscribe((res: any) => {
        // console.log(res);
        let shopOptions = {
          name: '',
          id: '',
        };

        shopOptions['name'] = res.name;
        shopOptions['id'] = res.id;

        this.shopOptions.push(shopOptions);
        this.filteredShopOptions.next(this.shopOptions);
        this.filterShop();
        // console.log(this.shopOptions);
        // console.log(this.filteredShopOptions);
      });
    } else {
      this.shopOptions = this.route.snapshot.data?.shops;
      this.filteredShopOptions.next(this.shopOptions);
      this.filterShop();
    }

    this.filteredMerchantOptions.next(this.merchantOptions);
    this.filterMerchant();

    this.filterProduct();
  }

  isDisabled = (): boolean => {
    return this.token.isAdmin() || this.initialStatus > PromotionStatus.DRAFT;
  };

  isPromotionStatusDisabled = (item: any): boolean => {
    return (
      this.initialStatus > item.id ||
      (this.token.isMerchant() && item.id > PromotionStatus.CONFIRMED) ||
      (this.token.isAdmin() && item.id == PromotionStatus.CONFIRMED) ||
      (this.initialStatus == PromotionStatus.DRAFT &&
        item.id == PromotionStatus.PUBLISHED)
    );
  };

  isReadOnly = (): boolean => {
    return this.initialStatus == PromotionStatus.PUBLISHED;
  };

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe();
  }

  formInit = (promotion: any) => {
    this.id = promotion.id;
    this.loadImage(promotion);

    // console.log(this.promotionCoverImageName);
    // console.log(promotion.startDate);
    // console.log(new Date(promotion.startDate));
    // console.log(new Date(promotion.startDate).getUTCDate());
    // console.log(promotion.startDate.toISOString());
    // console.log(promotion.startDate.toLocaleDateString());

    this.promotionForm = new FormGroup({
      type: new FormControl(promotion.type, [Validators.required]),
      merchantId: new FormControl(this.merchant, Validators.required),
      shopID: new FormControl(promotion.shop?.id, Validators.required),
      productID: new FormControl(promotion.product?.id),
      startDate: new FormControl(new Date(promotion.startDate), [
        Validators.required,
      ]),
      endDate: new FormControl(new Date(promotion.endDate), [
        Validators.required,
      ]),
      title: new FormControl(promotion.title, [Validators.required]),
      description: new FormControl(promotion.description, [
        Validators.required,
      ]),
      promotionStatus: new FormControl(promotion.promotionStatus, [
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

    if (this.type.value == PromotionType.Shop) {
      this.productID.clearValidators();
    } else {
      this.productID.setValidators([Validators.required]);
    }

    // console.log(this.promotionForm.controls.promotionCoverImage.value);
  };

  adjustDateForTimeOffset(dateToAdjust: Date) {
    var offsetMs = dateToAdjust.getTimezoneOffset() * 60000;
    return new Date(dateToAdjust.getTime() - offsetMs);
    // return dateToAdjust.toLocaleDateString();
  }

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
    const status = $event.value;
    const shopID = this.shopID.value;
    const productID = this.productID.value;
    const type = this.type.value;
    const startDate = this.startDate.value;
    const endDate = this.endDate.value;
    console.log(type);
    console.log(status);

    if (type && status != PromotionStatus.PUBLISHED && startDate && endDate) {
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
      // console.log(this.promotionForm.value);
      // console.log(this.systemService.dateFormatter(this.startDate.value));
      this.saveData();
    } else {
      console.log(this.promotionForm.value);
      console.log(this.promotionForm);
      this.snackBarService.message(
        'One or more required fields not filled yet.'
      );
    }
  }

  saveData() {
    this.isLoading = true;
    const promotion = this.promotionForm.value;

    if (
      this.initialStatus == PromotionStatus.DRAFT &&
      promotion.promotionStatus == PromotionStatus.CONFIRMED &&
      this.token.isMerchant()
    ) {
      this.processPayment = true;
    }

    promotion.type = parseInt(promotion.type, 10);
    this.promotionService
      .update(this.id, promotion)
      .subscribe((response: any) => {
        this.isLoading = false;
        this.snackBarService.fire(response);
        if (this.isImageUploadedRedis) {
          Promise.all([this.savePromotionImage(promotion.type)]).then(() => {
            this.responseMap(response?.payload?.data);
          });
        } else {
          this.responseMap(response?.payload?.data);
        }
      });
  }

  responseMap = (data: any) => {
    // let data = response?.payload?.data;
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
  };

  redirectList = () => {
    this.promotionForm.reset();
    this.router.navigate(['/dashboard/promotion/list']);
  };

  loadImage = (promotion: any): void => {
    this.promotionCoverImageName = promotion?.promotionCoverImage;

    if (
      promotion.promotionCoverImage.includes('http:') ||
      promotion.promotionCoverImage.includes('assets')
    ) {
      this.selectedCoverFile = new ImageSnippetDto(
        promotion.promotionCoverImage,
        new File(['fake'], 'fake.txt')
      );
    } else {
      let imageType = 8;
      if (this.responsePromotion.type == PromotionType.Banner) {
        imageType = ImageType.BANNER;
      } else if (this.responsePromotion.type == PromotionType.Product) {
        imageType = ImageType.PRODUCT_SLIDE;
      } else if (this.responsePromotion.type == PromotionType.Shop) {
        imageType = ImageType.SHOP_SLIDE;
      }

      this.selectedCoverFile = new ImageSnippetDto(
        this.imageService.loadImage(promotion?.promotionCoverImage, imageType),
        new File(['fake'], 'fake.txt')
      );
    }
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
            this.isImageUploadedRedis = true;
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
