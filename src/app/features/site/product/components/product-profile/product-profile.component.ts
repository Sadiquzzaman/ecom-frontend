import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductReviewDto } from '../../../../../../app/shared/dto/product/product-review.dto';
import { ProductService } from '../../../../../../app/features/site/product/product.service';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { ImageService } from '../../../../../shared/services/image.service';
import { ResponseService } from '../../../../../shared/services/response.service';
import { ShoppingCartService } from '../../../../../shared/services/shopping-cart.service';
import { ProductDto } from '../../../../../shared/dto/product/product.dto';
import { findIndex, map, tap } from 'rxjs/operators';
import { SystemService } from 'src/app/shared/services/system.service';
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation,
} from 'ngx-gallery-9';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-product-profile',
  templateUrl: './product-profile.component.html',
  styleUrls: ['./product-profile.component.scss'],
})
export class ProductProfileComponent implements OnInit, AfterViewInit {
  product: ProductDto;
  productDetails: any;
  isImageLoading = true;
  productImages: any[] = [];
  relatedProductInfo: ProductDto[] = [];

  productReviews: ProductReviewDto[] = [];

  productDescription = true;
  ratingReview = false;
  state: string;

  rating = 0;
  starCount = 5;

  attributes: {
    [x: string]: { name: string; id: string }[];
  } = {};
  attributeKeyNames: string[] = [];

  filter: any = {};

  firstLevelAttributes: any[] = [];
  firstLevelSelectedAttribute: any = {};

  secondLevelAttributes: any[] = [];
  secondLevelSelectedAttribute: any = {};

  selectedProductAttributeId: string;
  productAttributes: any;
  selectedProduct: any = {};
  isDefaultAttribute: boolean = false;

  navbar: any[];

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  images: any[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private imageService: ImageService,
    private router: Router,
    private cartService: ShoppingCartService,
    private rS: ResponseService,
    private cdRef: ChangeDetectorRef,
    private productService: ProductService,
    private systemService: SystemService,
    public token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.productDetails = data;
      this.initValues();
      this.setAttributes();
      this.loadImage();
      this.loadReviews();
      this.relatedProduct();
      this.initNavbar();
      this.gallerySettings();
    });
  }

  gallerySettings = () => {
    this.galleryOptions = [
      {
        width: '450px',
        height: '600px',
        thumbnailsColumns: 4,
        imageAnimation: 'rotate',
        previewZoom: true,
        previewCloseOnClick: true,
        previewCloseOnEsc: true,
        previewKeyboardNavigation: true,
        closeIcon: 'fa fa-times-circle',
      },
      // max-width 800
      {
        breakpoint: 500,
        width: '100%',
        height: '400px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
      },
      // max-width 400
      {
        breakpoint: 100,
        preview: false,
      },
    ];

    this.galleryImages = [
      {
        small:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-small.jpeg',
        medium:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-medium.jpeg',
        big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/1-big.jpeg',
      },
      {
        small:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-small.jpeg',
        medium:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-medium.jpeg',
        big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/2-big.jpeg',
      },
      {
        small:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-small.jpeg',
        medium:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-medium.jpeg',
        big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/3-big.jpeg',
      },
      {
        small:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/4-small.jpeg',
        medium:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/4-medium.jpeg',
        big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/4-big.jpeg',
      },
      {
        small:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/5-small.jpeg',
        medium:
          'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/5-medium.jpeg',
        big: 'https://lukasz-galka.github.io/ngx-gallery-demo/assets/img/5-big.jpeg',
      },
    ];
  };

  loadImage = (): void => {
    this.isImageLoading = true;
    this.productImages = [];

    if (
      this.productDetails.product?.image?.gallery &&
      this.productDetails.product?.image?.gallery.length
    ) {
      this.images = this.productDetails.product?.image?.gallery;
    } else {
      this.images.push(this.productDetails.product?.image?.cover);
    }

    Promise.all([
      this.images.forEach((image: any) => {
        let path = '';
        if (image.includes('http:')) {
          path = image;
        } else if (image.includes('assets')) {
          path = image;
        } else {
          path = this.imageService.loadImage(image, ImageType.PRODUCT_BIG);
        }
        this.productImages.push({
          small: path,
          medium: path,
          big: path,
        });
      }),
    ]).then(() => {
      this.isImageLoading = false;
    });
  };

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    // this.mouseActions();
  }

  mouseActions = () => {
    fromEvent(
      document.getElementsByClassName('ngx-gallery-image'),
      'mouseenter'
    ).subscribe((res: any) => {
      // console.log(res);
      this.zoomIn(res);
    });

    fromEvent(
      document.getElementsByClassName('ngx-gallery-image'),
      'mousemove'
    ).subscribe((res: any) => {
      // console.log(res);
      this.zoomIn(res);
    });

    fromEvent(
      document.getElementsByClassName('ngx-gallery-image'),
      'mouseleave'
    ).subscribe((res: any) => {
      // console.log(res);
      this.zoomOut();
    });
  };

  imageChange = ($event: any) => {
    console.log($event);
    // this.mouseActions();
  };

  zoomIn = (res: any) => {
    // var element: any = document.getElementById('overlay');
    // element.style.visibility = 'visible';

    // var details: any = document.getElementById('imageDetails');
    // details.style.visibility = 'hidden';

    // var x: any = res.clientX; // Get the horizontal coordinate
    // var y: any = res.clientY; // Get the vertical coordinate

    // element.style.top = y - 80;
    // element.style.left = x - 80;

    var pos, x, y;
    // pos = this.getCursorPos(res);
    var img: any = document.getElementsByClassName('ngx-gallery-image');

    var element: any = document.getElementById('overlay');
    // element.style.cssText = '';
    element.style.display = 'inline-block';
    // element.style.visibility = 'visible';

    var details: any = document.getElementById('imageDetails');
    details.style.display = 'none';
    // details.style.visibility = 'hidden';

    var imgSelector: any = document.querySelector('.ngx-gallery-image');
    var style = getComputedStyle(imgSelector);
    var backgroundImage = style.backgroundImage;

    var x: any = res.clientX - res.target.offsetLeft; // Get the horizontal coordinate
    var y: any = res.clientY - res.target.offsetTop; // Get the vertical coordinate

    console.log(x, y);

    // const transformOrigin =
    //   ((res.pageX - element.offset().left) / element.width()) * 100 +
    //   '% ' +
    //   ((res.pageY - element.offset().top) / element.height()) * 100 +
    //   '%';

    // element.style.transformOrigin = `${x}px ${y}px`;
    // element.style.transform = 'translate(`${x}px ${y}px`) sacale(2)';
    element.style.transform = 'sacale(3)';
    element.style.backgroundImage = backgroundImage;

    // console.log(img);
    // var imageUrl = img.attr('style');
    // console.log(imageUrl);
    // element.style.cssText = imageUrl;
    // var posX = res.offsetX ? res.offsetX : res.pageX - img.offsetLeft;
    // var posY = res.offsetY ? res.offsetY : res.pageY - img.offsetTop;
    // element.style.backgroundPosition = -posX * 2 + 'px ' + -posY * 4 + 'px';
  };

  getCursorPos = (e: any) => {
    var a,
      x = 0,
      y = 0;
    e = e || window.event;
    /* Get the x and y positions of the image: */
    var img: any = document.getElementsByClassName('ngx-gallery-image');
    a = img.getBoundingClientRect();
    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return { x: x, y: y };
  };

  zoomOut = () => {
    var element: any = document.getElementById('overlay');
    element.style.display = 'none';
    // element.style.visibility = 'hidden';
    var details: any = document.getElementById('imageDetails');
    details.style.display = 'inline-block';
    // details.style.visibility = 'visible';
  };

  initValues = () => {
    this.isImageLoading = true;
    this.productImages = [];
    this.relatedProductInfo = [];

    this.productReviews = [];

    this.productDescription = true;
    this.ratingReview = false;

    this.rating = 0;
    this.starCount = 5;

    this.attributes = {};
    this.attributeKeyNames = [];

    this.filter = {};

    this.firstLevelAttributes = [];
    this.firstLevelSelectedAttribute = {};

    this.secondLevelAttributes = [];
    this.secondLevelSelectedAttribute = {};

    this.selectedProduct = {};
    this.isDefaultAttribute = false;
  };

  initNavbar = () => {
    this.navbar = [];
    console.log(this.productDetails?.product);
    if (this.productDetails?.product?.category?.parent) {
      this.navbar.push({
        name: this.productDetails?.product?.category?.parent?.name,
        link:
          '/product/category/' +
          this.productDetails?.product?.category?.parent?.id,
      });
    }
    this.navbar.push({
      name: this.productDetails?.product?.category?.name,
      link: '/product/category/' + this.productDetails?.product?.category?.id,
    });
    this.navbar.push({ name: this.productDetails?.product?.name, link: '' });

    console.log(this.navbar);
  };

  onRatingChanged(rating: any) {
    this.rating = rating;
  }

  loadReviews = () => {
    this.productService
      .getProductReview(this.productDetails.product.id)
      .subscribe((res) => {
        this.productReviews = res?.payload?.data;
        // console.log('this.productReviews', this.productReviews);
      });
  };

  setInitialFilter = () => {
    for (let key of this.attributeKeyNames) {
      this.filter[key] = '';
    }
  };

  setAttributes = () => {
    if (!this.productDetails.product?.productAttributes?.length) {
      return;
    }

    this.productAttributes = this.productDetails.product?.productAttributes;

    this.productDetails.product.productAttributes.forEach((pa: any) => {
      if (pa?.attributes?.length) {
        var attributeKey: any = {};

        pa.attributes.forEach((attribute: any) => {
          attributeKey[attribute?.attributeGroup?.name] = attribute?.name;

          // console.log(attributeKey);

          this.attributes[attribute?.attributeGroup?.name] = [];
        });

        // console.log(attributeKey);

        pa['attributeDetails'] = attributeKey;
      }
    });

    // console.log(this.attributes);
    // console.log(this.productAttributes);

    this.productDetails.product.productAttributes.forEach((pa: any) => {
      if (pa?.attributes?.length) {
        pa.attributes.forEach((attribute: any) => {
          // if (attribute?.attributeGroup?.isColorGroup) {
          //   this.attributes[attribute?.attributeGroup?.name].push({
          //     name: attribute.color,
          //     id: attribute.id,
          //   });
          // } else {
          //   this.attributes[attribute?.attributeGroup?.name].push({
          //     name: attribute.name,
          //     id: attribute.id,
          //   });
          // }

          let isAavailable = this.attributes[
            attribute?.attributeGroup?.name
          ].find((element) => element.name === attribute.name);
          // console.log(isAavailable);

          if (!isAavailable) {
            this.attributes[attribute?.attributeGroup?.name].push({
              name: attribute.name,
              id: attribute.id,
            });
          }
        });
      }
    });

    // console.log(this.attributes);

    this.attributeKeyNames = this.productService.getMaxAttributeKeyNames(
      this.productDetails.product
    );
    // console.log(this.attributeKeyNames);

    this.setInitialFilter();

    if (this.attributeKeyNames && this.attributeKeyNames.length > 0) {
      this.firstLevelAttributes = this.productService.findAttributeNames(
        this.filter,
        this.attributeKeyNames,
        0,
        this.productDetails.product
      );
      // console.log(this.firstLevelAttributes);

      if (this.firstLevelAttributes && this.firstLevelAttributes.length) {
        this.firstLevelSelectedAttribute = this.firstLevelAttributes[0];
        this.selectedProductAttributeId = this.firstLevelSelectedAttribute.id;
        this.filter[this.firstLevelSelectedAttribute.key] =
          this.firstLevelSelectedAttribute.name;
        if (this.firstLevelSelectedAttribute.name.toLowerCase() == 'default') {
          this.isDefaultAttribute = true;
        }
      }
    }

    if (this.attributeKeyNames && this.attributeKeyNames.length > 1) {
      this.setSecondLevelAttributes();
    }

    this.setSelectedAttribute();
  };

  onFirstAttributeSelectionChange(value: any) {
    // let firstAttribute = this.firstLevelSelectedAttribute.name;
    // let secondAttribute = this.secondLevelSelectedAttribute.name;

    let selectedAttribute = this.firstLevelAttributes.filter(
      (attribute) => attribute.name === value
    );

    // console.log(this.firstLevelAttributes);
    // console.log(firstAttribute);
    // console.log(this.productAttributes);
    // console.log(selectedAttribute);

    if (selectedAttribute && selectedAttribute.length) {
      this.firstLevelSelectedAttribute = selectedAttribute[0];
      this.selectedProductAttributeId = this.firstLevelSelectedAttribute.id;
      this.filter = {};
      this.filter[this.firstLevelSelectedAttribute.key] =
        this.firstLevelSelectedAttribute.name;
      this.setSecondLevelAttributes();
      // console.log(this.filter);
      // console.log(this.productAttributes);
      this.setSelectedAttribute();
    }
  }

  onSecondAttributeSelectionChange(value: any) {
    let selectedAttribute = this.secondLevelAttributes.filter(
      (attribute) => attribute.name === value
    );
    if (selectedAttribute && selectedAttribute.length) {
      this.secondLevelSelectedAttribute = selectedAttribute[0];
      this.selectedProductAttributeId = this.secondLevelSelectedAttribute.id;
      this.filter[this.secondLevelSelectedAttribute.key] =
        this.secondLevelSelectedAttribute.name;
      this.setSelectedAttribute();
    }
  }

  setSelectedAttribute() {
    // console.log(this.filter);
    // console.log(this.productAttributes);
    let selectedProduct = this.productService.getSelectedProduct(
      this.filter,
      this.productAttributes
    );
    this.selectedProduct = selectedProduct[0];
    this.selectedProductAttributeId = this.selectedProduct?.id;
    // console.log(this.selectedProduct);
  }

  setSecondLevelAttributes() {
    this.secondLevelAttributes = this.productService.findAttributeNames(
      this.filter,
      this.attributeKeyNames,
      1,
      this.productDetails.product
    );
    if (this.secondLevelAttributes && this.secondLevelAttributes.length) {
      this.secondLevelSelectedAttribute = this.secondLevelAttributes[0];
      this.filter[this.secondLevelSelectedAttribute.key] =
        this.secondLevelSelectedAttribute.name;
    }
  }

  addToCart = (product: ProductDto) => {
    // console.log(product);
    // console.log(this.selectedProductAttributeId);
    if (this.selectedProductAttributeId) {
      let productAttribute = product.productAttributes.filter(
        (productAttribute) =>
          productAttribute.id === this.selectedProductAttributeId
      );
      // console.log(productAttribute);
      this.cartService.addProduct(product, 1, productAttribute[0]);
    } else {
      this.cartService.addProduct(product, 1);
    }
    this.rS.message('Added to cart successfully!!', false);
  };

  gotoShop = (product: ProductDto) => {
    console.log(product);

    this.router.navigate(['/shop/' + product?.shop?.name.replace(/\s/g, '~~')]);
  };

  showProductDescription() {
    this.productDescription = true;
    this.ratingReview = false;
  }

  showRatingReview(el: HTMLElement) {
    if (!this.token.isLoggedIn()) {
      // this.router.navigate(['/auth/login']);
      this.router.navigate(['/auth/login'], {
        state: { redirect: this.router.url },
      });
      return;
    } else {
      this.productDescription = false;
      this.ratingReview = true;
      if (el) {
        el.scrollIntoView();
      }
    }
  }

  ratingsReview(el: HTMLElement) {
    this.productDescription = false;
    this.ratingReview = true;
    if (el) {
      el.scrollIntoView();
    }
  }

  reviewSubmitted(data: any) {
    this.productReviews.push(data);
  }

  relatedProduct() {
    this.productService
      .getRandomRelatedProduct(this.productDetails?.product?.category.id)
      .subscribe((res) => {
        let relatedProductInfo = res?.payload?.data?.products || [];

        if (!relatedProductInfo.length) {
          this.relatedProductInfo = [];
          return;
        }

        let indexRemove = relatedProductInfo.findIndex(
          (product: ProductDto) =>
            product.id == this.productDetails?.product?.id
        );

        if (indexRemove > -1) {
          relatedProductInfo.splice(indexRemove, 1);
        }
        // else {
        //   this.relatedProductInfo.splice(this.relatedProductInfo.length - 1, 1);
        // }

        this.relatedProductInfo = this.systemService.getRandomElementFromArray(
          relatedProductInfo,
          8
        );
        // console.log(this.relatedProductInfo);
      });
  }
}
