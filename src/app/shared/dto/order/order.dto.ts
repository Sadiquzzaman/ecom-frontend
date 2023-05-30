import { BaseDto } from '../core/base.dto';
import { CartDto } from '../cart/cart.dto';
import { InvoiceDto } from '../payment/invoice/invoice.dto';
import { OrderDetailsDto } from './order-details.dto';
import { UserDto } from '../user/user.dto';
import { AddressDto } from '../core/address.dto';

export class OrderDto extends BaseDto {
  reference: string;

  coupon: string;

  invoice: InvoiceDto;

  cart: CartDto;

  user: UserDto;

  orderDetails: OrderDetailsDto[];

  shippingAddress: AddressDto;

  billingAddress: AddressDto;
}
