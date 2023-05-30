import { OrderDto } from './../../../../../shared/dto/order/order.dto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../order.service';
import { UsersService } from '../../../../../core/services/users.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { UserDto } from '../../../../../shared/dto/user/user.dto';
import { SystemService } from 'src/app/shared/services/system.service';
import { ImageType } from 'src/app/core/enum/image-type.enum';

@Component({
  selector: 'app-status-history',
  templateUrl: './status-history.component.html',
  styleUrls: ['./status-history.component.scss'],
})
export class StatusHistoryComponent implements OnInit {
  displayedColumns: string[] = [
    'image',
    'productDescription',
    'unitPrice',
    'quantity',
    'discount',
    // 'shippingCharge',
    'subTotal',
    // 'button',
  ];
  dataSource: any[] = [];
  orderId: string;
  user: UserDto;
  order: any;
  totalPrice: number;
  totalShippingCost: number;
  shippingCharge = 40;
  isLoading: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly orderService: OrderService,
    private readonly usersService: UsersService,
    public readonly token: TokenStorageService,
    public readonly system: SystemService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadUserAddress();
    this.activatedRoute.paramMap.subscribe((params) => {
      this.orderId = params.get('orderId') as string;
      this.loadOrderDetails(this.orderId);
    });
  }

  loadOrderDetails(id: string) {
    this.orderService.findByID(id).subscribe(
      (res) => {
        if (!res.error && res.payload?.data) {
          this.order = res?.payload?.data;
          console.log(this.order);
          this.dataSource = this.order.orderDetails;
          this.totalShippingCost = Number(
            this.order?.orderDetails
              ?.reduce(
                (acc: number, current: any) =>
                  acc +
                  Number(current.productAttribute.additionalShippingCost) +
                  this.shippingCharge,
                0
              )
              .toFixed(2)
          );
          this.totalPrice = Number(
            this.order?.orderDetails
              ?.reduce(
                (acc: number, current: any) =>
                  acc +
                  Number(current.productAttribute.price) * current.quantity -
                  current.productAttribute.discount,
                0
              )
              .toFixed(2)
          );
          this.totalPrice = this.totalPrice + this.totalShippingCost;
          console.log(this.totalPrice);
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  loadUserAddress() {
    this.usersService.findProfileById(this.token.getUserId()).subscribe(
      (res) => {
        if (!res.error && res.payload?.data) {
          this.user = res?.payload?.data;
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  getImage = (imageName: string) => {
    if (!imageName) return;
    return this.system.getImageSource(imageName, ImageType.PRODUCT_SMALL);
  };
}
