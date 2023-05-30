import { OrderDto } from './../../../../../shared/dto/order/order.dto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../order.service';
import { UsersService } from '../../../../../core/services/users.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { UserDto } from '../../../../../shared/dto/user/user.dto';
import { DeliveryStatus } from 'src/app/shared/enum/delivery-status.enum';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-delivery-history',
  templateUrl: './delivery-history.component.html',
  styleUrls: ['./delivery-history.component.scss'],
})
export class DeliveryHistoryComponent implements OnInit {
  displayedColumns: string[] = [
    'image',
    'productDescription',
    'unitPrice',
    'quantity',
    'discount',
    'shippingCharge',
    'subTotal',
    'button',
  ];
  dataSource: any[] = [];
  orderId: string;
  user: UserDto;
  order: any;
  shopInvoice: any[] = [];
  totalPrice: number;
  totalShippingCost: number;
  shippingCharge = 40;
  shippingStatus = DeliveryStatus;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly orderService: OrderService,
    private readonly usersService: UsersService,
    private readonly token: TokenStorageService
  ) {}

  ngOnInit(): void {
    // this.activatedRoute.paramMap.subscribe((params) => {
    //   this.orderId = params.get('orderId') as string;
    //   this.loadOrderDetails(this.orderId);
    //   this.loadUserAddress();
    // });

    this.loadUserAddress();

    this.activatedRoute.paramMap
      .pipe(
        tap((params: any) => {
          this.orderId = params.get('orderId') as string;
        }),
        switchMap(() => {
          return this.orderService.shippingStatusByOrderID(this.orderId);
        })
      )
      .subscribe((res) => {
        if (!res.error && res.payload?.data) {
          this.order = res?.payload?.data;
          this.shopInvoice = this.order?.invoice?.shopInvoice;
        }
      });
  }

  loadUserAddress() {
    this.usersService
      .findProfileById(this.token.getUserId())
      .subscribe((res) => {
        if (!res.error && res.payload?.data) {
          this.user = res?.payload?.data;
        }
      });
  }

  loadOrderDetails(id: string) {
    this.orderService.shippingStatusByOrderID(id).subscribe((res) => {
      if (!res.error && res.payload?.data) {
        this.order = res?.payload?.data;
        // let i = 1;
        // this.order?.invoice?.shopInvoice.forEach((element:any) => {
        //   ++i;
        //   element['deliveryStatus'] = i;
        //   this.shopInvoice.push(element);
        // });
        this.shopInvoice = this.order?.invoice?.shopInvoice;
      }
    });
  }
}
