import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../core/services/api-config.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MicroserviceURL } from '../../core/enum/microservices.enum';
import { CartDto } from '../dto/cart/cart.dto';
import { CartDetailsDto } from '../dto/cart/cart-details.dto';
import { ProductDto } from '../dto/product/product.dto';
import { CreateCartDto } from '../dto/cart/create/create-cart.dto';
import { ResponseDto } from '../dto/reponse/response.dto';
import { OrderDto } from '../dto/order/order.dto';
import { CartService } from 'src/app/features/site/cart/cart.service';
import { tap, concatMap } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + `carts`;
  orderBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.ORDER) + `orders`;
  couponKey = 'ecom-user-cart-coupon';
  cartKey = 'ecom-user-cart';
  orderKey = 'ecom-user-is-order-placed';
  pendingOrderKey = 'ecom-user-pending-order';
  cartDetails: any[];

  cartInfo: any = {};
  cartInfoDetails: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private readonly apiConfigService: ApiConfigService,
    private readonly cartService: CartService,
    private readonly token: TokenStorageService
  ) {
    // console.log('token:', this.token.isCustomer());
  }

  loadCurrentCart() {
    // if (this.token.isLoggedIn()) {
      this.cartService
        .loadCustomerCart()
        .pipe(
          tap((res) => {
            // console.log(res);
            this.loadCartInfo(res);
          }),
          concatMap(() => {
            return this.cart$;
          })
        )
        .subscribe((cart: any) => {
          // this.cartCalculation(cart);
          // this.isLoading = false;
        });
    // }
  }

  loadCartInfo = (res: any) => {
    if (res.error || !res.payload?.data) {
      return;
    }

    this.cartInfo = {};
    this.cartInfo = res.payload?.data;
    this.cartInfoDetails = this.cartInfo.cartDetails;

    // console.log('cartInfo', this.cartInfo);
    if (this.cartInfoDetails?.length) {
      this.clearCart();
      // this.cartInfoDetails.sort(this.sortByAttributeId);
      this.cartInfoDetails.forEach((item: any) => {
        this.addProduct(item.product, item.quantity, item.productAttribute);
      });
    }
  };

  getCart = (): CartDetailsDto[] => {
    const cart = localStorage.getItem(`${this.cartKey}`);
    return cart ? JSON.parse(cart) : [];
  };

  private cart: BehaviorSubject<CartDetailsDto[]> = new BehaviorSubject<
    CartDetailsDto[]
  >(this.getCart());
  public cart$: Observable<any[]> = this.cart.asObservable();

  setCart = (cart: CartDetailsDto[]): void => {
    localStorage.setItem(`${this.cartKey}`, JSON.stringify(cart));
    this.cart.next(this.getCart());
  };

  getCartDetails = () => {
    this.cart$.subscribe((cart) => {
      this.cartDetails = cart;
    });
  };

  clearCart = (): void => {
    localStorage.removeItem(`${this.cartKey}`);
    this.cart.next(this.getCart());
  };

  clearAllKey = (): void => {
    localStorage.removeItem(`${this.cartKey}`);
    localStorage.removeItem(`${this.couponKey}`);
    localStorage.removeItem(`${this.orderKey}`);
    localStorage.removeItem(`${this.pendingOrderKey}`);
    this.cart.next(this.getCart());
    this.coupon.next(this.getCoupon());
    this.placedOrder.next(this.getPlacedOrder());
  };

  /*********************** placed order *********************/
  getPlacedOrder = (): any => {
    const order = localStorage.getItem(`${this.orderKey}`);
    return order ? JSON.parse(order) : {};
  };

  private placedOrder: BehaviorSubject<CartDto> = new BehaviorSubject<CartDto>(
    this.getPlacedOrder()
  );
  public placedOrder$: Observable<CartDto> = this.placedOrder.asObservable();

  setPlacedOrder = (cart: CreateCartDto): void => {
    localStorage.setItem(`${this.orderKey}`, JSON.stringify(cart));
    this.placedOrder.next(this.getPlacedOrder());
  };

  setPendingOrder = (order: OrderDto): void => {
    localStorage.setItem(`${this.pendingOrderKey}`, JSON.stringify(order));
  };

  removePlacedOrder = (): void => {
    localStorage.removeItem(`${this.orderKey}`);
    this.placedOrder.next(this.getPlacedOrder());
  };

  getIndex = (
    cart: any,
    productId: string,
    selectedProductAttributeId: any = null
  ) => {
    const _index: number = cart.findIndex((c: CartDetailsDto) => {
      if (c.product.id === productId) {
        if (!selectedProductAttributeId) return true;

        if (c.productAttribute.id == selectedProductAttributeId) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });

    return _index;
  };

  addProduct = (
    product: any,
    quantity: number,
    productAttribute: any = null
  ) => {
    const cart = this.getCart();
    const exist = this.getIndex(cart, product.id, productAttribute.id);

    if (exist > -1) {
      if (productAttribute) {
        cart[exist].productAttribute = productAttribute;
      }
      cart[exist].quantity++;
    } else {
      const cartContent = new CartDetailsDto();
      if (productAttribute) {
        cartContent.productAttribute = productAttribute;
      }
      cartContent.product = product;
      cartContent.quantity = quantity;
      cart.push(cartContent);
    }
    this.setCart(cart);
  };

  decrementProduct = (product: ProductDto, productAttribute: any = null) => {
    const cart = this.getCart();
    const exist = this.getIndex(cart, product.id, productAttribute.id);
    if (exist > -1) {
      cart[exist].quantity--;
    }
    this.setCart(cart);
  };

  removeProduct = (
    productID: string,
    selectedProductAttributeId: any = null
  ) => {
    const cart = this.getCart();
    const exist = this.getIndex(cart, productID, selectedProductAttributeId);
    if (exist > -1) {
      cart.splice(exist, 1);
    }
    this.setCart(cart);
  };

  /*********************** coupon ********************/
  getCoupon = (): string =>
    (localStorage.getItem(`${this.couponKey}`) || '').toString().trim();

  private coupon: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.getCoupon()
  );
  public coupon$: Observable<string> = this.coupon.asObservable();

  addCoupon = (coupon: string) => {
    localStorage.setItem(`${this.couponKey}`, coupon);
    this.coupon.next(this.getCoupon());
  };

  /****************** create cart db ***************/
  createCart = (cart: any): Observable<ResponseDto> =>
    this.httpClient.post(this.baseUrl, cart) as Observable<ResponseDto>;

  createOrder = (cart: any): Observable<ResponseDto> =>
    this.httpClient.post(this.orderBaseUrl, cart) as Observable<ResponseDto>;

  calculateCart(cart: any, additionalShippingCost = 0): any {
    const calculatedCart = {
      items: 0,
      totalAmount: 0,
      discount: 0,
      additionalShippingCharge: 0,
      vat: 0,
      shippingCharge: 0,
      grandTotal: 0,
    };
    if (cart) {
      calculatedCart.items = cart.length || 0;
      const total = cart.reduce((acc: number, current: any) => {
        if (current?.productAttribute) {
          // eslint-disable-next-line max-len

          calculatedCart.discount =
            calculatedCart.discount +
            Number(current?.productAttribute?.discount || 0) * current.quantity;

          // eslint-disable-next-line max-len
          // calculatedCart.additionalShippingCharge =
          //   calculatedCart.additionalShippingCharge +
          //   Number(current?.productAttribute?.additionalShippingCost || 0) *
          //   current.quantity;

          return (
            acc +
            Number(current?.productAttribute?.price || 0) * current.quantity
          );
        } else {
          // eslint-disable-next-line max-len
          calculatedCart.discount =
            calculatedCart.discount +
            Number(current?.product?.discount || 0) * current.quantity;

          // eslint-disable-next-line max-len
          // calculatedCart.additionalShippingCharge =
          //   calculatedCart.additionalShippingCharge +
          //   Number(current?.product?.additionalShippingCost || 0) *
          //     current.quantity;

          return acc + Number(current?.product?.price || 0) * current.quantity;
        }
      }, 0);

      calculatedCart.totalAmount = this.toFixedNumber(total);
      calculatedCart.discount = this.toFixedNumber(calculatedCart.discount);

      calculatedCart.additionalShippingCharge = this.toFixedNumber(
        additionalShippingCost
      );

      calculatedCart.vat = this.toFixedNumber(calculatedCart.vat);
      if (calculatedCart.items > 0) {
        calculatedCart.shippingCharge = 0;
        // eslint-disable-next-line max-len
        calculatedCart.grandTotal =
          calculatedCart.totalAmount -
          calculatedCart.discount +
          calculatedCart.vat +
          calculatedCart.shippingCharge +
          calculatedCart.additionalShippingCharge;
      } else {
        calculatedCart.shippingCharge = 0;
        calculatedCart.grandTotal = 0;
      }
    }
    calculatedCart.shippingCharge = this.toFixedNumber(
      calculatedCart.shippingCharge
    );
    calculatedCart.grandTotal = this.toFixedNumber(calculatedCart.grandTotal);
    return calculatedCart;
  }

  showPaymentPage(): boolean {
    const placedOrder = this.getPlacedOrder();
    if (!placedOrder.cartDetails || placedOrder.cartDetails.length === 0) {
      return false;
    }
    return this.compareCartDetails(placedOrder.cartDetails, this.getCart());
  }

  compareCartDetails(
    placedCartDetails: CartDetailsDto[],
    currentCartDetails: CartDetailsDto[]
  ): boolean {
    if (
      placedCartDetails &&
      currentCartDetails &&
      placedCartDetails.length !== currentCartDetails.length
    ) {
      return false;
    }
    for (const placedCartDetail of placedCartDetails) {
      const foundIndex = currentCartDetails.findIndex(
        (currentCartDetail) =>
          placedCartDetail.product.id === currentCartDetail.product.id
      );
      if (foundIndex < 0) {
        return false;
      }
      if (
        placedCartDetail.quantity !== currentCartDetails[foundIndex].quantity
      ) {
        return false;
      }
    }
    return true;
  }

  toFixedNumber = (value: string | number): number =>
    Number(Number(value.toString()).toFixed(2));

  setShippingAddress(
    cartId: string,
    shippingId: string
  ): Observable<ResponseDto> {
    return this.httpClient.post(
      this.orderBaseUrl + '/set-shipping-address/' + cartId + '/' + shippingId,
      {}
    ) as Observable<ResponseDto>;
  }
}
