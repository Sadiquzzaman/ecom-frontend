import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageSnippetDto } from '../../../../../core/dto/image.dto';
import { ProductService } from '../../product.service';
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
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { ResponseService } from '../../../../../shared/services/response.service';
import { StringToHexColorService } from '../../../../../core/services/string-to-hex-color.service';
import { ProductAttributeInterface } from '../../interfaces/product-attribute.interface';
import { ProductAttributeService } from '../../product-attribute.service';
import { ProductImageService } from '../../product-image.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit, OnDestroy {
  readableQuantity = false;
  isLoading = false;
  imageError = false;
  btnLabel = 'SUBMIT';
  isShopSearching = false;
  shopFiltering: FormControl = new FormControl();
  shopOptions: Array<{ id: string; name: string }> = [];
  filteredShopOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);
  isCategorySearching = false;
  categoryFiltering: FormControl = new FormControl();
  categoryOptions: Array<{ id: string; name: string }> = [];
  filteredCategoryOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);
  /************** combination *****************/
  advanceFeature = false;
  attributeGroups: any[] = [];
  combination: any = {};
  productCombination: {
    price: number;
    weight: number;
    purchasedPrice: number;
    quantity: number;
    discount: number;
    wholesalePrice: number;
    additionalShippingCost: number;
    reference: string;
    image: string;
    imagePreview: ImageSnippetDto;
    combination: any;
  }[] = [];
  displayedColumns: string[] = ['name', 'combination', 'quantity', 'action'];
  /**************** image *******************/
  selectedProductGallery: ImageSnippetDto[] = [];
  selectedProductCover!: ImageSnippetDto;
  productImages: { cover: string; gallery: string[] } = {
    cover: '',
    gallery: [],
  };
  addProductForm!: FormGroup;
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService,
    private readonly productAttributeService: ProductAttributeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly token: TokenStorageService,
    private readonly rS: ResponseService,
    private readonly stringToHexColorService: StringToHexColorService
  ) {
    // console.log('ccc');
    if (this.token.isAdmin()) {
      // this.router.navigate(['/dashboard/product/add']);
    } else {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe();
  }

  ngOnInit(): void {
    // console.log('aaa');
    this.categoryOptions = this.route.snapshot.data?.categories;
    this.filteredCategoryOptions.next(this.categoryOptions);

    this.shopOptions = this.route.snapshot.data?.shops;
    this.filteredShopOptions.next(this.shopOptions);

    this.attributeGroups = this.route.snapshot.data?.attributeGroups;

    // console.log('bbb');

    this.initForm();
    this.filterShop();
    this.filterCategory();
    this.filterWholeSalePrice();
  }

  initForm = () => {
    this.addProductForm = new FormGroup({
      userID: new FormControl(this.token.getUserId(), Validators.required),
      shopID: new FormControl('', Validators.required),
      categoryID: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      price: new FormControl(null, Validators.required),
      weight: new FormControl(null, Validators.required),
      purchasedPrice: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required),
      description: new FormControl(''),

      image: new FormControl(
        {
          cover: '',
          gallery: [],
        },
        Validators.required
      ),
      isRefundable: new FormControl(null, Validators.required),

      summary: new FormControl('', Validators.required),
      metaDescription: new FormControl('', Validators.required),
      metaKeywords: new FormControl('', Validators.required),
      metaTitle: new FormControl('', Validators.required),
      reference: new FormControl(
        'E-' + Date.now().toString(),
        Validators.required
      ),

      wholesalePrice: new FormControl(null),
      discount: new FormControl(0),
      lowStockThreshold: new FormControl(3),
      additionalShippingCost: new FormControl(0),

      onSale: new FormControl(1),
      isVirtual: new FormControl(0),
      isPack: new FormControl(0),
      hasProductAttribute: new FormControl(0),
    });
  };

  /******************* filter *************************/
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

  filterCategory = () => {
    this.categoryFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isCategorySearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.categoryOptions) {
            return [];
          }
          return this.categoryOptions.filter(
            (category) =>
              category.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isCategorySearching = false;
          this.filteredCategoryOptions.next(filtered);
        },
        () => {
          this.isCategorySearching = false;
        }
      );
  };

  filterWholeSalePrice = () => {
    this.addProductForm.controls.price.valueChanges.subscribe((change) => {
      this.addProductForm.controls.wholesalePrice.setValue(change);
    });
  };

  /****************** plus and minus *******************/
  inc = (field: string) => {
    const value = this.addProductForm.controls[field].value as number;
    this.addProductForm.controls[field].setValue(Number(value) + 1);
  };

  dec = (field: string) => {
    const value = this.addProductForm.controls[field].value as number;
    if (value > 0) {
      this.addProductForm.controls[field].setValue(Number(value) - 1);
    }
  };

  convertToHex = (str: string): string =>
    this.stringToHexColorService.stringToColor(str);

  /********************** image ************************/

  getFiles = (input: any) => {
    const files: File[] = input.files;

    if (files) {
      const galleryLength = this.productImages.gallery.length;
      const currentLength = this.productImages.cover
        ? 1 + galleryLength + files.length
        : galleryLength + files.length;

      if (currentLength > 10) {
        this.rS.message('Sorry!! You can select maximum 10 images.');
      } else {
        for (let x = 0; x < files.length; x++) {
          this.waitForProductImageRes(x, files[x]);
        }
      }
    }
  };

  waitForProductImageRes = (index: number, image: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      if (!this.selectedProductCover && index === 0) {
        this.selectedProductCover = new ImageSnippetDto(
          event.target.result,
          image
        );

        this.productImageService
          .uploadProductCoverRedis(this.selectedProductCover.file)
          .subscribe(
            (res) => {
              this.productImages.cover = res.filename;
              this.addProductForm.controls.image.setValue(this.productImages);
            },
            (err) => {
              console.log(err);
            }
          );
      } else {
        const thisImage = new ImageSnippetDto(event.target.result, image);
        this.selectedProductGallery.push(thisImage);

        this.productImageService
          .uploadProductGalleryRedis(thisImage.file)
          .subscribe(
            (res) => {
              this.productImages.gallery.push(res.filename);
              this.addProductForm.controls.image.setValue(this.productImages);
            },
            (err) => {
              console.log(err);
            }
          );
      }
      this.imageError = false;
    });
    reader.readAsDataURL(image);
  };

  makeItCoverImage = (image: ImageSnippetDto, index: number) => {
    /*for show*/
    this.selectedProductGallery[index] = this.selectedProductCover;
    this.selectedProductCover = image;

    /*for value*/
    const preGallery = this.productImages.gallery[index];
    this.productImages.gallery[index] = this.productImages.cover;
    this.productImages.cover = preGallery;

    /*setter*/
    this.productImages.gallery = this.productImages.gallery.filter(
      (f) => f !== null
    );
    this.addProductForm.controls.image.setValue(this.productImages);
  };

  showAdvanceFeature = () => {
    let valid = true;
    [
      'shopID',
      'categoryID',
      'userID',
      'name',
      'price',
      'weight',
      'quantity',
      'description',
    ].forEach((each) => {
      if (!this.addProductForm.controls[each].valid) {
        valid = false;
        this.addProductForm.controls[each].markAsTouched();
      }
    });

    if (valid) {
      if (this.addProductForm.controls.image.value.cover) {
        this.imageError = false;
        this.advanceFeature = true;
      } else {
        this.rS.message('Please select at least one image!');
        this.imageError = true;
      }
    } else {
      this.rS.message('Fill all the fields first!!');
    }
    // this.advanceFeature = true;
  };

  /********************** combination ********************/
  ifNoAttribute = (): boolean => !Object.keys(this.combination).length;

  generateQuantity = () => {
    let total = 0;
    for (let pc of this.productCombination) {
      total += pc.quantity;
    }
    if (total > 0) {
      this.readableQuantity = true;
      this.addProductForm.controls.quantity.setValue(total);
      this.addProductForm.controls.hasProductAttribute.setValue(1);
    } else {
      this.readableQuantity = false;
      this.addProductForm.controls.hasProductAttribute.setValue(0);
    }
  };

  generateMasterPrice = () => {
    let price = [];
    for (let pc of this.productCombination) {
      if (pc.quantity) {
        price.push(pc.price);
      }
    }
    let pr = Math.min(...price);
    this.addProductForm.controls.price.setValue(pr);
  };

  generateCombination = (): void => {
    let sortedCombination: any = {};

    Object.keys(this.combination)
      .sort()
      .forEach((key) => {
        sortedCombination[key] = this.combination[key];
      });

    const index = this.productCombination.findIndex(
      (f) => JSON.stringify(f.combination) === JSON.stringify(sortedCombination)
    );

    if (index > -1) {
      this.productCombination[index].quantity += 1;
    } else {
      this.productCombination.push({
        price: this.addProductForm.controls.price.value,
        weight: this.addProductForm.controls.weight.value,
        purchasedPrice: this.addProductForm.controls.wholesalePrice.value,
        quantity: 1,
        discount: 0,

        wholesalePrice: this.addProductForm.controls.wholesalePrice.value,
        additionalShippingCost:
          this.addProductForm.controls.additionalShippingCost.value,

        image: this.productImages.cover,
        imagePreview: this.selectedProductCover,

        reference:
          this.addProductForm.controls.reference.value +
          '-' +
          Object.keys(sortedCombination)
            .map((m) => m.toLowerCase() + '#' + sortedCombination[m].value)
            .join('-'),

        combination: sortedCombination,
      });
    }
    sortedCombination = {};
    this.combination = {};
    this.generateQuantity();
    this.generateMasterPrice();
  };

  showCombination = (combination: any): string => {
    let str = '';
    Object.keys(combination).forEach((key) => {
      str += key + ': ' + combination[key].value + ', ';
    });
    return str.slice(0, -2);
  };

  changeCombinationQuantity = (e: any, index: number) => {
    this.productCombination[index].quantity = Number(e.target.value || 1);
    this.generateQuantity();
  };

  changeCombinationPrice = (e: any, index: number) => {
    this.productCombination[index].price = Number(
      e.target.value || this.addProductForm.controls.price.value
    );
    this.generateMasterPrice();
  };
  changeCombinationWeight = (e: any, index: number) => {
    this.productCombination[index].weight = Number(
      e.target.value || this.addProductForm.controls.weight.value
    );
  };

  changeCombinationPurchasedPrice = (e: any, index: number) => {
    this.productCombination[index].purchasedPrice = Number(
      e.target.value || this.addProductForm.controls.purchasedPrice.value
    );
  };

  changeCombinationDiscount = (e: any, index: number) => {
    this.productCombination[index].discount = Number(e.target.value || 0);
  };

  changeCombinationImage = (combinationIndex: number, imageIndex: number) => {
    if (imageIndex < 0) {
      this.productCombination[combinationIndex].image =
        this.productImages.cover;
      this.productCombination[combinationIndex].imagePreview =
        this.selectedProductCover;
    } else {
      this.productCombination[combinationIndex].image =
        this.productImages.gallery[imageIndex];
      this.productCombination[combinationIndex].imagePreview =
        this.selectedProductGallery[imageIndex];
    }
  };

  removeCombination = (index: number) => {
    this.productCombination.splice(index, 1);
    this.generateQuantity();
  };

  /******************** save******************/
  save = () => {
    if (this.token.isAdmin()) {
      this.adminSave();
    } else {
      this.merchantSave();
    }
  };

  adminSave = () => {
    if (this.addProductForm.valid) {
      this.isLoading = true;

      this.productService
        .adminProductCcreate(this.addProductForm.value)
        .subscribe((res) => {
          if (res.error && res.error.hasOwnProperty('error')) {
            res = res.error;
          }

          if (!res.error && res.payload) {
            /*************image upload *********************/
            const galleryImages = [];
            for (const gallery of res?.payload?.data?.image?.gallery) {
              galleryImages.push(
                this.productImageService.uploadProductGallery(gallery)
              );
            }

            Promise.all([
              this.productImageService
                .uploadProductCover(res?.payload?.data?.image?.cover)
                .subscribe(),
              ...galleryImages.map((m) => m.subscribe()),
            ]).then(() => {
              console.log('All images uploaded!!');
            });

            /************** attributes upload ***************/
            const combinations: ProductAttributeInterface[] = [];

            for (const pc of this.productCombination) {
              combinations.push({
                reference: pc.reference,
                additionalShippingCost: pc.additionalShippingCost,
                discount: pc.discount,
                image: pc.image,
                price: pc.price,
                weight: pc.weight,
                purchasedPrice: pc.purchasedPrice,
                quantity: pc.quantity,
                wholesalePrice: pc.wholesalePrice,
                productID: res.payload.data.id,
                attributesID: Object.keys(pc.combination).map((m) => ({
                  id: pc.combination[m].id,
                })),
              });
            }

            if (combinations.length <= 0) {
              this.router.navigate(['/dashboard/product/list']);
              return;
            }

            // add product attributes
            this.productAttributeService
              .bulkCreate(combinations)
              .subscribe((attrResponse) => {
                this.isLoading = false;
                if (this.rS.fire(attrResponse)) {
                  this.rS.fire(res);

                  this.addProductForm.reset();
                  this.productCombination = [];

                  this.router.navigate(['/dashboard/product/list']);
                }
              });
          } else {
            this.isLoading = false;
            //this.btnLabel = 'TRY AGAIN';
          }
        });
    } else {
      this.rS.message('Please fill all the fields!!');
      this.advanceFeature = true;
    }
  };

  merchantSave = () => {
    if (this.addProductForm.valid) {
      this.isLoading = true;

      this.productService
        .merchnatProductCcreate(this.addProductForm.value)
        .subscribe((res) => {
          if (res.error && res.error.hasOwnProperty('error')) {
            res = res.error;
          }

          if (!res.error && res.payload) {
            /*************image upload *********************/
            const galleryImages = [];
            for (const gallery of res?.payload?.data?.image?.gallery) {
              galleryImages.push(
                this.productImageService.uploadProductGallery(gallery)
              );
            }

            Promise.all([
              this.productImageService
                .uploadProductCover(res?.payload?.data?.image?.cover)
                .subscribe(),
              ...galleryImages.map((m) => m.subscribe()),
            ]).then(() => {
              console.log('All images uploaded!!');
            });

            /************** attributes upload ***************/
            const combinations: ProductAttributeInterface[] = [];

            for (const pc of this.productCombination) {
              combinations.push({
                reference: pc.reference,
                additionalShippingCost: pc.additionalShippingCost,
                discount: pc.discount,
                image: pc.image,
                price: pc.price,
                weight: pc.weight,
                purchasedPrice: pc.purchasedPrice,
                quantity: pc.quantity,
                wholesalePrice: pc.wholesalePrice,
                productID: res.payload.data.id,
                attributesID: Object.keys(pc.combination).map((m) => ({
                  id: pc.combination[m].id,
                })),
              });
            }

            if (combinations.length <= 0) {
              this.router.navigate(['/dashboard/product/list']);
              return;
            }

            // add product attributes
            this.productAttributeService
              .bulkCreate(combinations)
              .subscribe((attrResponse) => {
                this.isLoading = false;
                if (this.rS.fire(attrResponse)) {
                  this.rS.fire(res);

                  this.addProductForm.reset();
                  this.productCombination = [];

                  this.router.navigate(['/dashboard/product/list']);
                }
              });
          } else {
            this.isLoading = false;
            //this.btnLabel = 'TRY AGAIN';
          }
        });
    } else {
      this.rS.message('Please fill all the fields!!');
      this.advanceFeature = true;
    }
  };
}
