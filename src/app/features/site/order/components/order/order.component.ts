import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../../../app/shared/services/response.service';
import { MicroserviceURL } from '../../../../../core/enum/microservices.enum';
import { ApiConfigService } from '../../../../../core/services/api-config.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { CartDto } from '../../../../../shared/dto/cart/cart.dto';
import { OrderDto } from '../../../../../shared/dto/order/order.dto';
import { ShoppingCartService } from '../../../../../shared/services/shopping-cart.service';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orderId: '';
  cart: CartDto;
  order: OrderDto | any;
  userId: string;
  index: number;
  unit = ['Item', 'Items'];

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
  cuponType: any;
  reductionPercent: any;
  totalAmountTaka: any;
  cuponValue: any;
  cuponValueStr: string;

  termCheckValue = false;

  // termsAgreeForm!: FormGroup;
  // agreeCheck = new FormControl('', Validators.required);

  isActive: any;
  coupon = '';
  selectedPaymentMethod = 'Online Payment';
  paymentMethods: string[] = ['Cash on Delivery', 'Online Payment'];
  paymentUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private tokenStorageService: TokenStorageService,
    public dialog: MatDialog,
    private readonly orderService: OrderService,
    private readonly rS: ResponseService
  ) {
    this.shoppingCartService.coupon$.subscribe((coupon) => {
      this.coupon = coupon;
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.orderId = data.id;
    });
    this.order = this.route.snapshot.data?.order;

    this.cart = this.order.cart;
    this.cuponType = this.order.coupon;

    this.calculatedCart = this.shoppingCartService.calculateCart(
      this.cart.cartDetails,
      this.order.cart.additionalShippingCost
    );

    if (this.calculatedCart.items <= 1) {
      this.index = 0;
    } else {
      this.index = 1;
    }

    new Promise((resolve) => {
      // this.initSslCommerze();
      resolve(true);
    })
      .then(() => {
        this.shoppingCartService.removePlacedOrder();
      })
      .catch(() => {});

    this.totalAmountTaka =
      this.calculatedCart.totalAmount +
      this.calculatedCart.shippingCharge +
      this.calculatedCart.additionalShippingCharge -
      this.calculatedCart.discount;

    this.cuponValue = 0.0;
    this.cuponValueStr = '';
    if (this.cuponType) {
      if (parseFloat(`${this.cuponType.reductionPercent}`) > 0) {
        this.reductionPercent = parseFloat(
          `${this.cuponType.reductionPercent}`
        );
        this.cuponValue =
          (parseFloat(`${this.cuponType.reductionPercent}`) / 100.0) *
          parseFloat(`${this.totalAmountTaka}`);
        this.cuponValueStr = `${this.cuponType.reductionPercent} %`;
      } else {
        this.cuponValue = parseFloat(`${this.cuponType.reductionAmount}`);
        this.cuponValueStr = `Tk ${this.cuponType.reductionAmount}`;
      }
    }
    this.totalPriceincludeVat =
      parseFloat(`${this.totalAmountTaka}`) -
      parseFloat(`${this.cuponValue}`) +
      parseFloat(`${this.calculatedCart.vat}`);
  }

  submit = (e: any) => {
    console.log('eeeeeee', e);

    if (e.value == 1) {
      this.termCheckValue = true;
      new Promise((resolve) => {
        this.initSslCommerze();
        resolve(true);
      })
        .then(() => {
          this.shoppingCartService.removePlacedOrder();
        })
        .catch(() => {});
    } else {
      this.termCheckValue = false;
    }
  };

  initSslCommerze = () => {
    const sslBtn: any = document.getElementById('sslczPayBtn');
    sslBtn?.setAttribute('token', this.tokenStorageService.getToken());
    sslBtn?.setAttribute('order', this.order.transMaster.id);
    sslBtn?.setAttribute('postdata', {});
    sslBtn?.setAttribute('endpoint', this.paymentUrl + 'ssl-commerze/prepare');
    const script: any = document.createElement('script');
    const tag = document.getElementsByTagName('script')[0];
    script.src =
      this.apiConfigService.getPaymentMerchantApi() +
      Math.random().toString(36).substring(7);
    tag.parentNode?.insertBefore(script, tag);
  };

  goto = () => {
    this.router.navigate(['/dashboard/order']);
  };

  changeStatus(status: number) {
    if (this.termCheckValue === true) {
      console.log(this.termCheckValue);

      const statusDto = { status };
      this.orderService
        .changeStatusByID(this.orderId, statusDto)
        .subscribe((res) => {
          if (res?.payload?.data?.status == 2) {
            this.rS.message('Your order has been confirmed!!', false);
            this.goto();
          }
        });
    } else {
      this.rS.message('Please accept terms and condition first');
    }
  }
}
