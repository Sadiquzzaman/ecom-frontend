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
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { ImageService } from '../../../../../shared/services/image.service';
import { SystemService } from 'src/app/shared/services/system.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  readableQuantity = true;
  id = '';
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
  productCombinations: {
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
    productAttribute: any;
  }[] = [];
  displayedColumns: string[] = ['name', 'combination', 'quantity', 'action'];
  /**************** image *******************/
  selectedProductGallery: ImageSnippetDto[] = [];
  selectedProductCover!: ImageSnippetDto;
  productImages: { cover: string; gallery: string[] } = {
    cover: '',
    gallery: [],
  };
  editProductForm: FormGroup;
  currentQuantity = 0;
  productIds: string[] = [];

  isApproved = this.route.snapshot.data.product.isApproved;
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService,
    private readonly productAttributeService: ProductAttributeService,
    public readonly token: TokenStorageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly rS: ResponseService,
    private readonly stringToHexColorService: StringToHexColorService,
    private readonly imageService: ImageService,
    private readonly systemService: SystemService
  ) {
    if (!this.token.isAdmin()) {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe();
  }

  ngOnInit(): void {
    // console.log(this.route.snapshot.data?.product);
    this.categoryOptions = this.route.snapshot.data?.categories;
    this.filteredCategoryOptions.next(this.categoryOptions);

    this.shopOptions = this.route.snapshot.data?.shops;
    this.filteredShopOptions.next(this.shopOptions);

    this.attributeGroups = this.route.snapshot.data?.attributeGroups;
    this.currentQuantity = this.route.snapshot.data?.product?.quantity;
    this.initForm(this.route.snapshot.data?.product);
    this.filterShop();
    this.filterCategory();
    this.filterWholeSalePrice();
    this.disableShopType();
    console.log(this.isApproved);
  }

  initForm = (product: any) => {
    console.log(product);
    console.log(product);
    this.loadImage(product);
    this.loadProductAttributes(product);
    this.id = product.id;
    this.editProductForm = new FormGroup({
      userID: new FormControl(this.token.getUserId(), Validators.required),
      shopID: new FormControl(product.shop?.id, Validators.required),
      categoryID: new FormControl(product.category?.id, Validators.required),
      name: new FormControl(product.name, Validators.required),
      price: new FormControl(product.price, Validators.required),
      weight: new FormControl(product.weight, Validators.required),
      purchasedPrice: new FormControl(
        product.purchasedPrice,
        Validators.required
      ),
      quantity: new FormControl(product.quantity, Validators.required),
      description: new FormControl(product.description),

      image: new FormControl(
        {
          cover: product.image?.cover,
          gallery: product.image?.gallery,
        },
        Validators.required
      ),

      isRefundable: new FormControl(product.isRefundable, Validators.required),

      summary: new FormControl(product.summary, Validators.required),
      metaDescription: new FormControl(
        product.metaDescription,
        Validators.required
      ),
      metaKeywords: new FormControl(product.metaKeywords, Validators.required),
      metaTitle: new FormControl(product.metaTitle, Validators.required),
      reference: new FormControl(
        'E-' + Date.now().toString(),
        Validators.required
      ),

      wholesalePrice: new FormControl(product.wholesalePrice),
      discount: new FormControl(product.discount),
      lowStockThreshold: new FormControl(product.lowStockThreshold),
      additionalShippingCost: new FormControl(product.additionalShippingCost),

      onSale: new FormControl(product.onSale),
      isVirtual: new FormControl(product.isVirtual),
      isPack: new FormControl(product.isPack),
      hasProductAttribute: new FormControl(0),
    });
  };

  disableShopType = () => {
    if (this.route?.snapshot?.data?.product.isApproved == 1) {
      if (this.token.isAdmin()) {
        this.editProductForm.controls['categoryID'].enable();
        this.editProductForm.controls['isRefundable'].enable();
      } else {
        this.editProductForm.controls['categoryID'].disable();
        this.editProductForm.controls['isRefundable'].disable();
      }
    }
  };

  loadImage = (product: any): void => {
    this.productImages.cover = product?.image?.cover;
    this.productImages.gallery = product?.image?.gallery || [];

    if (!this.productImages.cover) {
      return;
    }

    if (
      product?.image?.cover.includes('http:') ||
      product?.image?.cover.includes('assets')
    ) {
      this.selectedProductCover = new ImageSnippetDto(
        product?.image?.cover,
        new File(['fake'], 'fake.txt')
      );
    } else {
      this.selectedProductCover = new ImageSnippetDto(
        this.imageService.loadImage(
          product?.image?.cover,
          ImageType.PRODUCT_SMALL
        ),
        new File(['fake'], 'fake.txt')
      );
    }

    if (this.productImages?.gallery && this.productImages?.gallery.length) {
      console.log(this.productImages?.gallery);

      for (const imageName of this.productImages.gallery) {
        if (!imageName) {
          continue;
        }
        if (imageName.includes('http:') || imageName.includes('assets')) {
          this.selectedProductGallery.push(
            new ImageSnippetDto(imageName, new File(['fake'], 'fake.txt'))
          );
        } else {
          this.selectedProductGallery.push(
            new ImageSnippetDto(
              this.imageService.loadImage(imageName, ImageType.PRODUCT_SMALL),
              new File(['fake'], 'fake.txt')
            )
          );
        }
      }
    }
  };

  loadProductAttributes = (product: any): void => {
    for (const productAttribute of product.productAttributes) {
      const sortedCombination: any = {};
      this.combination = {};
      for (const attribute of productAttribute.attributes) {
        if (
          attribute.attributeGroup &&
          attribute.attributeGroup.name.toLowerCase() !== 'default'
        ) {
          this.combination[attribute.attributeGroup.name] = {
            id: attribute.id,
            value: attribute.name,
          };
        }
      }
      if (!this.systemService.isObjectEmpty(this.combination)) {
        Object.keys(this.combination)
          .sort()
          .forEach((key) => {
            sortedCombination[key] = this.combination[key];
          });
        this.productCombinations.push({
          price: productAttribute.price,
          weight: productAttribute.weight,
          purchasedPrice: productAttribute.purchasedPrice,
          quantity: productAttribute.quantity,
          discount: productAttribute.discount,

          wholesalePrice: productAttribute.wholesalePrice,
          additionalShippingCost: productAttribute.additionalShippingCost,

          image: productAttribute.image,
          imagePreview: new ImageSnippetDto(
            this.imageService.loadImage(
              productAttribute.image,
              ImageType.PRODUCT_SMALL
            ),
            new File(['fake'], 'fake.txt')
          ),

          reference: productAttribute.reference,

          combination: sortedCombination,
          productAttribute,
        });
      }
    }
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
    this.editProductForm.controls.price.valueChanges.subscribe((change) => {
      this.editProductForm.controls.wholesalePrice.setValue(change);
    });
  };

  /****************** plus and minus *******************/
  inc = (field: string) => {
    const value = this.editProductForm.controls[field].value as number;
    this.editProductForm.controls[field].setValue(Number(value) + 1);
  };

  dec = (field: string) => {
    const value = this.editProductForm.controls[field].value as number;
    if (value > 0) {
      this.editProductForm.controls[field].setValue(Number(value) - 1);
    }
  };

  convertToHex = (str: string): string =>
    this.stringToHexColorService.stringToColor(str);

  /********************** image ************************/

  getFiles = (input: any) => {
    const files: File[] = input.files;
    console.log(files);
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
              this.editProductForm.controls.image.setValue(this.productImages);
            },
            (err) => {
              console.log(err);
            }
          );
      } else {
        const thisImage = new ImageSnippetDto(event.target.result, image);
        this.selectedProductGallery.push(thisImage);
        console.log(this.selectedProductGallery);
        this.productImageService
          .uploadProductGalleryRedis(thisImage.file)
          .subscribe(
            (res) => {
              this.productImages.gallery.push(res.filename);
              this.editProductForm.controls.image.setValue(this.productImages);
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
    this.editProductForm.controls.image.setValue(this.productImages);
  };

  deleteImage = (image: ImageSnippetDto, index: number) => {
    /*for show*/
    // this.selectedProductGallery[index] = this.selectedProductCover;
    // this.selectedProductCover = image;

    if (this.selectedProductGallery[index]) {
      delete this.selectedProductGallery[index];
    }

    if (this.productImages.gallery[index]) {
      delete this.productImages.gallery[index];
    }

    /*for value*/
    // const preGallery = this.productImages.gallery[index];
    // this.productImages.gallery[index] = this.productImages.cover;
    // this.productImages.cover = preGallery;

    /*setter*/
    this.productImages.gallery = this.productImages.gallery.filter(
      (f) => f !== null
    );
    this.editProductForm.controls.image.setValue(this.productImages);
  };

  showAdvanceFeature = () => {
    let valid = true;
    [
      'shopID',
      'categoryID',
      'userID',
      'name',
      'weight',
      'price',
      'quantity',
      'description',
    ].forEach((each) => {
      if (!this.editProductForm.controls[each].valid) {
        valid = false;
        this.editProductForm.controls[each].markAsTouched();
      }
    });

    if (valid) {
      if (this.editProductForm.controls.image.value.cover) {
        this.imageError = false;
        this.advanceFeature = true;
      } else {
        this.rS.message('Please select at least one image!');
        this.imageError = true;
      }
    } else {
      this.rS.message('Fill all the fields first!!');
    }
  };

  /********************** combination ********************/
  ifNoAttribute = (): boolean => !Object.keys(this.combination).length;

  generateQuantity = () => {
    let total = 0;
    for (let pc of this.productCombinations) {
      total += pc.quantity;
    }
    if (total > 0) {
      this.readableQuantity = true;
      this.editProductForm.controls.quantity.setValue(total);
      this.editProductForm.controls.hasProductAttribute.setValue(1);
    } else {
      this.readableQuantity = false;
      this.editProductForm.controls.hasProductAttribute.setValue(0);
    }
  };

  generateMasterPrice = () => {
    let price = [];
    for (let pc of this.productCombinations) {
      if (pc.quantity) {
        price.push(pc.price);
      }
    }
    let pr = Math.min(...price);
    this.editProductForm.controls.price.setValue(pr);
  };

  generateCombination = (): void => {
    let sortedCombination: any = {};

    Object.keys(this.combination)
      .sort()
      .forEach((key) => {
        sortedCombination[key] = this.combination[key];
      });

    const index = this.productCombinations.findIndex(
      (f) => JSON.stringify(f.combination) === JSON.stringify(sortedCombination)
    );

    if (index > -1) {
      this.productCombinations[index].quantity += 1;
    } else {
      this.productCombinations.push({
        price: this.editProductForm.controls.price.value,
        weight: this.editProductForm.controls.weight.value,
        purchasedPrice: this.editProductForm.controls.purchasedPrice.value,
        quantity: 1,
        discount: 0,

        wholesalePrice: this.editProductForm.controls.wholesalePrice.value,
        additionalShippingCost:
          this.editProductForm.controls.additionalShippingCost.value,

        image: this.productImages.cover,
        imagePreview: this.selectedProductCover,

        reference:
          this.editProductForm.controls.reference.value +
          '-' +
          Object.keys(sortedCombination)
            .map((m) => m.toLowerCase() + '#' + sortedCombination[m].value)
            .join('-'),

        combination: sortedCombination,
        productAttribute: null,
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
    this.productCombinations[index].quantity = Number(e.target.value || 1);
    this.generateQuantity();
  };

  changeCombinationWeight = (e: any, index: number) => {
    this.productCombinations[index].weight = Number(
      e.target.value || this.editProductForm.controls.weight.value
    );
  };

  changeCombinationPrice = (e: any, index: number) => {
    this.productCombinations[index].price = Number(
      e.target.value || this.editProductForm.controls.price.value
    );
    this.generateMasterPrice();
  };

  changeCombinationPurchasedPrice = (e: any, index: number) => {
    this.productCombinations[index].purchasedPrice = Number(
      e.target.value || this.editProductForm.controls.purchasedPrice.value
    );
  };

  isNotChangeable = (index: number): boolean => {
    if (this.productCombinations[index].productAttribute) {
      return false;
    } else {
      return true;
    }
  };

  changeCombinationDiscount = (e: any, index: number) => {
    this.productCombinations[index].discount = Number(e.target.value || 0);
  };

  changeCombinationImage = (combinationIndex: number, imageIndex: number) => {
    if (imageIndex < 0) {
      this.productCombinations[combinationIndex].image =
        this.productImages.cover;
      this.productCombinations[combinationIndex].imagePreview =
        this.selectedProductCover;
    } else {
      this.productCombinations[combinationIndex].image =
        this.productImages.gallery[imageIndex];
      this.productCombinations[combinationIndex].imagePreview =
        this.selectedProductGallery[imageIndex];
    }
  };

  removeCombination = (index: number) => {
    this.productCombinations.splice(index, 1);
    this.generateQuantity();
  };

  /******************** save******************/
  save = () => {
    console.log(this.editProductForm.value);
    if (this.editProductForm.valid) {
      this.isLoading = true;
      this.productService
        .update(this.id, this.editProductForm.value)
        .subscribe((res) => {
          if (res.error && res.error.hasOwnProperty('error')) {
            res = res.error;
          }

          if (!res.error && res.payload) {
            this.uploadProductCoverImage(res?.payload?.data?.image?.cover);
            this.uploadProductGalleryImage(res?.payload?.data?.image?.gallery);
            this.createOrUpdateProductAttribute(res);
          } else {
            this.isLoading = false;
          }
        });
    } else {
      this.rS.message('Please fill all the fields!!');
      this.advanceFeature = true;
    }
  };

  createOrUpdateProductAttribute = (res: any) => {
    /************** attributes upload ***************/
    const updatableCombinations = [];
    const creatableCombinations: ProductAttributeInterface[] = [];

    for (const productCombination of this.productCombinations) {
      const productAttribute = this.processCombination(res, productCombination);
      if (productCombination.productAttribute) {
        updatableCombinations.push(
          this.productAttributeService.updateProductAttribute(
            productCombination.productAttribute.id,
            productAttribute
          )
        );
      } else {
        creatableCombinations.push(productAttribute);
      }
    }

    if (
      updatableCombinations.length <= 0 &&
      creatableCombinations.length <= 0
    ) {
      this.router.navigate(['/dashboard/product/list']);
      this.rS.fire(res);
      return;
    }

    Promise.all([
      this.productAttributeService
        .bulkCreate(creatableCombinations)
        .subscribe(),
      updatableCombinations.map((c) => c.subscribe()),
    ]).then(() => {
      // this.isLoading = false;
      this.rS.fire(res);
      this.router.navigate(['/dashboard/product/list']);
    });
  };

  processCombination = (
    res: any,
    productCombination: any
  ): ProductAttributeInterface => {
    return {
      reference: productCombination.reference,
      additionalShippingCost: productCombination.additionalShippingCost,
      discount: productCombination.discount,
      image: productCombination.image,
      price: productCombination.price,
      weight: productCombination.weight,
      purchasedPrice: productCombination.purchasedPrice,
      quantity: productCombination.quantity,
      wholesalePrice: productCombination.wholesalePrice,
      productID: res.payload.data.id,
      attributesID: Object.keys(productCombination.combination).map((m) => ({
        id: productCombination.combination[m].id,
      })),
    };
  };

  uploadProductCoverImage = (imageName: string) => {
    const file = this.selectedProductCover.file;
    if (file.name === 'fake.txt') {
      return;
    }
    let name = file.name.split('.')[0];
    name = name.replace(/\s/g, '');

    if (imageName.indexOf(name) < 0) {
      return;
    }

    this.productImageService.uploadProductCover(imageName).subscribe();
  };

  uploadProductGalleryImage = (galleryImageNames: string[]) => {
    const galleryImages = [];
    for (const imageSnippet of this.selectedProductGallery) {
      const file = imageSnippet.file;
      if (file.name === 'fake.txt') {
        continue;
      }
      let name = file.name.split('.')[0];
      name = name.replace(/\s/g, '');
      for (const imageName of galleryImageNames) {
        if (imageName.indexOf(name) >= 0) {
          galleryImages.push(
            this.productImageService.uploadProductGallery(imageName)
          );
          break;
        }
      }
    }
    galleryImages.map((m) => m.subscribe());
  };

  approveOne = () => {
    this.productIds.push(this.route.snapshot.data.product.id);

    if (this.isApproved === 0) {
      let dto = { ids: this.productIds, status: true };
      this.productService.updateApprovalStatus(dto).subscribe(() => {
        this.isApproved = 1;
        this.rS.message('Product Approved Successfully !!!', false);
      });
    } else {
      let dto = { ids: this.productIds, status: false };
      this.productService.updateApprovalStatus(dto).subscribe(() => {
        this.isApproved = 0;
        this.rS.message('Product Unapproved Successfully !!!', false);
      });
    }
  };
}
