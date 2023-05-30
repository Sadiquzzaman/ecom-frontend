import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../../../../../shared/services/shopping-cart.service';
import { CartInterface } from '../../../../../shared/interfaces/cart.interface';
import { CartService } from '../../cart.service';
import { ProductAttributeDto } from '../../../../../shared/dto/product/product-attribute.dto';
import { ResponseService } from '../../../../../shared/services/response.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { MatDialog } from '@angular/material/dialog';
import { AddressService } from '../../../order/address.service';
import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { ShippingDialogComponent } from '../../../../../../app/shared/components/features/site/shipping-dialog/shipping-dialog.component';
import { CreateCartDetailsDto } from 'src/app/shared/dto/cart/create/create-cart-details.dto';
import { CartDetailsDto } from 'src/app/shared/dto/cart/cart-details.dto';
import { ProductDto } from 'src/app/shared/dto/product/product.dto';
import { concatMap, tap } from 'rxjs/operators';
import { SystemService } from 'src/app/shared/services/system.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageService } from 'src/app/shared/services/image.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  imageType = ImageType.PRODUCT_SMALL;
  cart: CartInterface[] | any[];
  cartInfo: any = {};
  cartInfoDetails: any[] = [];

  // cartInfoDetailsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
  //   []
  // );
  // cartInfoDetailsObservable$: Observable<any[]> =
  //   this.cartInfoDetailsSubject.asObservable();

  isCartInfoLoad = false;
  shippingAddresses: any[] = [];
  selection: any = null;
  coupon = '';
  calculatedCart = {
    items: 0,
    totalAmount: 0,
    discount: 0,
    additionalShippingCharge: 0,
    vat: 0,
    shippingCharge: 0,
    grandTotal: 0,
  };
  totalPrice: any;
  totalPriceincludeVat: any;
  cuponInfo: any;
  reductionPercent: any;
  totalAmount: any;
  cuponValue: any;
  cuponValueStr: string;

  isLoading = false;
  unit = ['Item', 'Items'];
  index: number;
  // loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private readonly router: Router,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly cartService: CartService,
    private readonly rS: ResponseService,
    private readonly tokenService: TokenStorageService,
    private readonly addressService: AddressService,
    private readonly loaderService: LoaderService,
    public systemService: SystemService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.getShippingAddress();
    this.addNewShippingAddress();
    if (this.tokenService.isLoggedIn()) {
      // console.log('aa');
      this.loadCurrentCart();
    }
  }

  getShippingAddress = () => {
    this.addressService.getCustomerShippingAddresses().subscribe((res) => {
      if (!res.error && res.payload?.data) {
        for (const address of res.payload?.data) {
          this.shippingAddresses.push(address);
          // console.log(this.shippingAddresses);
        }
      }
    });
  };

  couponApply = () => {
    this.shoppingCartService.addCoupon(this.coupon);
    this.rS.message('COUPON IS APPLIED', false);
  };

  loadCurrentCart() {
    this.isLoading = true;
    this.isCartInfoLoad = false;

    this.cartService
      .loadCustomerCart()
      .pipe(
        tap((res) => {
          this.loadCartInfo(res);
        }),
        concatMap(() => {
          return this.shoppingCartService.cart$;
        })
      )
      .subscribe((cart: any) => {
        this.cartCalculation(cart);
        this.isLoading = false;
      });
  }

  loadCartInfo = (res: any) => {
    if (!res.error && !res.payload?.data?.id) {
      this.router.navigate(['/product']);
    }
    this.cartInfo = {};
    this.cartInfo = res.payload?.data;
    this.cartInfoDetails = this.cartInfo.cartDetails;
    this.processCartInfoDetails(this.cartInfoDetails);
    // this.cartInfoDetailsSubject.next(this.cartInfoDetails);

    this.cuponInfo = this.cartInfo.coupon;
    this.isCartInfoLoad = true;

    // console.log('cartInfo', this.cartInfo);
    if (this.cartInfoDetails.length) {
      this.shoppingCartService.clearCart();
      // this.cartInfoDetails.sort(this.sortByAttributeId);
      this.cartInfoDetails.forEach((item: any) => {
        this.shoppingCartService.addProduct(
          item.product,
          item.quantity,
          item.productAttribute
        );
      });
    }
  };

  processCartInfoDetails = (cartInfoDetails: any[]) => {
    this.cartInfoDetails = cartInfoDetails.map((value) => {
      let attributes = value.productAttribute.attributes;
      // console.log(attributes);
      attributes.sort((a: any, b: any) => {
        var nameA = a.attributeGroup.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.attributeGroup.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      // console.log(attributes);
      value.productAttribute.attributes = attributes;

      let img = value.product.image.cover;

      let src = this.systemService.loadImage(img, this.imageType);

      value['product']['src'] = src;

      return value;
    });
  };

  loadCartInfoPartial = (
    res: any,
    product: any = null,
    quantity: number = 0,
    productAttribute: any = null
  ) => {
    if (!res.error && !res.payload?.data?.id) {
      this.router.navigate(['/product']);
    }

    this.cartInfo = {};
    this.cartInfo = res.payload?.data;
    this.cartInfoDetails = this.cartInfo.cartDetails;
    this.processCartInfoDetails(this.cartInfoDetails);
    // console.log(this.cartInfoDetails);

    console.log(this.cartInfoDetails);

    // this.cartInfoDetailsSubject.next(this.cartInfoDetails);
    this.cuponInfo = this.cartInfo.coupon;
    this.isCartInfoLoad = true;

    if (quantity > 0) {
      this.shoppingCartService.addProduct(product, quantity, productAttribute);
    } else if (quantity == 0) {
      this.shoppingCartService.removeProduct(product, productAttribute);
    } else {
      this.shoppingCartService.decrementProduct(product, productAttribute);
    }
  };

  cartCalculation = (cart: any) => {
    this.cart = cart;
    this.calculatedCart = this.shoppingCartService.calculateCart(
      cart,
      this.cartInfo.additionalShippingCost
    );
    if (this.calculatedCart.items <= 1) {
      this.index = 0;
    } else {
      this.index = 1;
    }

    this.totalAmount =
      this.calculatedCart.totalAmount +
      this.calculatedCart.shippingCharge +
      this.calculatedCart.additionalShippingCharge -
      this.calculatedCart.discount;

    this.cuponValue = 0.0;
    this.cuponValueStr = '';

    if (this.cuponInfo) {
      if (parseFloat(`${this.cuponInfo?.reductionPercent}`) > 0) {
        this.reductionPercent = parseFloat(
          `${this.cuponInfo.reductionPercent}`
        );
        this.cuponValue =
          (parseFloat(`${this.cuponInfo.reductionPercent}`) / 100.0) *
          parseFloat(`${this.totalAmount}`);
        this.cuponValueStr = `${this.cuponInfo.reductionPercent} %`;
      } else {
        this.cuponValue = parseFloat(`${this.cuponInfo?.reductionAmount}`);
        this.cuponValueStr = `Tk ${this.cuponInfo.reductionAmount}`;
      }
      //this.totalPriceincludeVat = ((parseFloat(`${(this.totalAmount)}`) - parseFloat(`${(this.cuponValue)}`) ) + parseFloat(`${(this.calculatedCart.vat)}`));
    }

    this.totalPriceincludeVat =
      parseFloat(`${this.totalAmount}`) -
      parseFloat(`${this.cuponValue}`) +
      parseFloat(`${this.calculatedCart.vat}`);
  };

  sortByAttributeId = (a: any, b: any) => {
    return a.productAttribute.id.localeCompare(b.productAttribute.id);
  };

  increment = (product: any, selectedProductAttributeId: any = null) => {
    if (selectedProductAttributeId) {
      this.isCartInfoLoad = false;
      let productAttribute = this.cartInfo?.cartDetails.filter(
        (cart: any) => cart.productAttribute.id === selectedProductAttributeId
      );
      this.addProduct(product, 1, productAttribute[0]['productAttribute']);
      this.placeOrder(product, 1, productAttribute[0]['productAttribute']);
    }
  };

  addProduct = (
    product: any,
    quantity: number,
    productAttribute: any = null
  ) => {
    this.cart = this.shoppingCartService.getCart();
    const exist = this.shoppingCartService.getIndex(
      this.cart,
      product.id,
      productAttribute.id
    );

    if (exist > -1) {
      if (productAttribute) {
        this.cart[exist].productAttribute = productAttribute;
      }
      this.cart[exist].quantity++;
    } else {
      const cartContent = new CartDetailsDto();
      if (productAttribute) {
        cartContent.productAttribute = productAttribute;
      }
      cartContent.product = product;
      cartContent.quantity = quantity;
      this.cart.push(cartContent);
    }
  };

  decrement = (
    product: any,
    quantity: number,
    selectedProductAttributeId: any = null
  ) => {
    if (quantity !== 1) {
      if (selectedProductAttributeId) {
        this.isCartInfoLoad = false;
        let productAttribute = this.cartInfo?.cartDetails.filter(
          (cart: any) => cart.productAttribute.id === selectedProductAttributeId
        );
        this.decrementProduct(product, productAttribute[0]['productAttribute']);
        this.placeOrder(product, -1, productAttribute[0]['productAttribute']);
      }
      // else {
      //   this.decrementProduct(product);
      // }
      // this.placeOrder();
    }
  };

  decrementProduct = (product: ProductDto, productAttribute: any = null) => {
    this.cart = this.shoppingCartService.getCart();
    const exist = this.shoppingCartService.getIndex(
      this.cart,
      product.id,
      productAttribute.id
    );
    if (exist > -1) {
      this.cart[exist].quantity--;
    }
  };

  remove = (productID: string, selectedProductAttributeId: any = null) => {
    if (selectedProductAttributeId) {
      this.removeProduct(productID, selectedProductAttributeId);
    } else {
      this.removeProduct(productID);
    }
    this.placeOrder(productID, 0, selectedProductAttributeId);
  };

  removeProduct = (
    productID: string,
    selectedProductAttributeId: any = null
  ) => {
    this.cart = this.shoppingCartService.getCart();
    const exist = this.shoppingCartService.getIndex(
      this.cart,
      productID,
      selectedProductAttributeId
    );
    if (exist > -1) {
      this.cart.splice(exist, 1);
    }
  };

  placeOrder = (
    product: any = null,
    quantity: number = 0,
    productAttribute: any = null
  ) => {
    if (!this.tokenService.isLoggedIn()) {
      // this.router.navigate(['/auth', 'login']);
      this.router.navigate(['/auth/login'], {
        state: { redirect: this.router.url },
      });
    }

    if (!this.cart?.length) {
      this.rS.message('Add something to the cart first!!');
      return;
    }

    this.isLoading = true;
    const cartDetails: CreateCartDetailsDto[] = [];
    this.cart.forEach((cartDetail) => {
      const createCartDetailsDto = new CreateCartDetailsDto();
      createCartDetailsDto.quantity = cartDetail?.quantity;
      createCartDetailsDto.productID = cartDetail?.product?.id;
      if (cartDetail?.productAttribute?.id) {
        createCartDetailsDto.productAttributeID =
          cartDetail?.productAttribute?.id;
      }
      cartDetails.push(createCartDetailsDto);
    });
    const cart = {
      userID: this.tokenService.getUserId(),
      couponCode: this.shoppingCartService.getCoupon(),
      cartDetails,
    };

    this.shoppingCartService
      .createCart(cart)
      .pipe(
        tap((res) => {
          console.log(res);
          this.loadCartInfoPartial(res, product, quantity, productAttribute);
        }),
        concatMap(() => {
          return this.shoppingCartService.cart$;
        })
      )
      .subscribe(
        (cart: any) => {
          this.cartCalculation(cart);
          this.isLoading = false;
          this.isCartInfoLoad = true;
        },
        (error: any) => {
          console.log(error);
          this.isLoading = false;
          this.isCartInfoLoad = true;
        }
      );

    // this.shoppingCartService.createCart(cart).subscribe(
    //   (res: any) => {
    //     if (!res.error && res?.payload.data) {
    //       // this.cartInfo = {};
    //       //this.rS.message('Cart Updated Successfully', false);
    //       this.shoppingCartService.setPlacedOrder(res?.payload?.data);
    //       // this.hideCart();
    //       // this.router.navigate(['/cart']);
    //       // this.redirectTo('cart');
    //       this.loadCurrentCart();
    //       // this.getShippingAddress();
    //       //this.addNewShippingAddress();

    //       this.loadCartInfo(res);
    //     }
    //   },
    //   (error: any) => {
    //     console.log(error);
    //     this.isLoading = false;
    //   }
    // );
  };

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  // order part
  proceedToBilling = (): void => {
    if (this.selection === null) {
      this.rS.message('Please select shipping address!!');
      return;
    } else {
      if (!this.cart?.length) {
        this.rS.message('Add something to the cart first!!');
        return;
      }
      if (this.tokenService.isLoggedIn()) {
        this.generateOrder();
      } else {
        // this.router.navigate(['/auth/login']);
        this.router.navigate(['/auth/login'], {
          state: { redirect: this.router.url },
        });
      }
    }
  };

  generateOrder = () => {
    const cartID = this.shoppingCartService.getPlacedOrder().id;
    const cart = {
      shippingAddressId: this.selection.id,
      userID: this.tokenService.getUserId(),
      cartID,
      coupon: this.coupon,
      reference: 'test',
      status: 1,
    };
    if (!this.isLoading) {
      this.isLoading = true;
      this.shoppingCartService.createOrder(cart).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (!res.error && res?.payload?.data) {
            this.rS.message(
              'Order is created. Redirecting to billing page!',
              false
            );
            // this.shoppingCartService
            //   .setShippingAddress(cartID, this.selection.id)
            //   .subscribe((data: any) => {});
            this.shoppingCartService.clearCart();
            this.shoppingCartService.removePlacedOrder();
            this.shoppingCartService.setPendingOrder(res?.payload?.data);
            this.router.navigate(['/order/' + res?.payload?.data?.id]);
          }
        },
        (error: any) => {
          console.log(error);
          this.isLoading = false;
        }
      );
    }
  };

  getSize = (productAttribute: ProductAttributeDto): string => {
    // console.log('size', productAttribute.attributes);
    // console.log('productAttribute', productAttribute);

    let size = '';
    if (!productAttribute) {
      return size;
    }
    for (const attribute of productAttribute.attributes) {
      if (attribute?.attributeGroup?.name?.toLowerCase() === 'size') {
        size = attribute.name;
        break;
      }
    }
    // console.log('test', size);

    return size;
  };

  getColor = (productAttribute: ProductAttributeDto): string => {
    let color = '';
    if (!productAttribute) {
      return color;
    }
    for (const attribute of productAttribute.attributes) {
      if (attribute?.attributeGroup?.isColorGroup) {
        color = attribute.color;
        break;
      }
    }
    return color;
  };

  getPrice(product: any) {
    if (product && product.productAttribute) {
      return Number(product?.productAttribute?.price || 0);
    } else {
      return Number(product?.product?.price || 0);
    }
  }

  toFixedNumber = (value: string | number): number =>
    Number(Number(value.toString()).toFixed(2));

  addNewShippingAddress() {
    this.loaderService.shippingAddress.subscribe((data) => {
      if (data) {
        const addressIndex = this.shippingAddresses.findIndex(
          (address) => address.id === data.id
        );
        if (addressIndex > -1) {
          this.shippingAddresses[addressIndex] = data;
        } else {
          this.shippingAddresses.push(data);
        }
      }
    });
  }

  deleteShippingAddress() {
    this.addressService
      .deleteShippingAddress(this.selection.id)
      .subscribe((res) => {
        if (!res.error) {
          this.rS.fire(res);
          this.shippingAddresses = this.shippingAddresses.filter(
            (address) => address.id !== this.selection.id
          );
        }
      });
  }

  openDialog(status: boolean): void {
    console.log(this.selection);
    this.addressService.setShippingAddress(this.selection, status);
    const dialogRef = this.dialog.open(ShippingDialogComponent, {
      width: '30rem',
      autoFocus: false,
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  // increment = (product: any, productAttribute: any) => {
  //   this.shoppingCartService.addProduct(product, 1, productAttribute);
  //   this.loadCurrentCart();
  // };

  // decrement = (product: any, productAttribute: any) => {
  //   this.shoppingCartService.decrementProduct(product, productAttribute);
  //   this.loadCurrentCart();
  // };

  // remove = (productID: string) => {
  //   this.shoppingCartService.removeProduct(productID);
  // };
}
