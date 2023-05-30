import { Gender } from '../../enum/gender.enum';
import { BaseDto } from '../core/base.dto';
import { AffiliatorDto } from './affiliator.dto';
import { CustomerDto } from './customer.dto';
import { EmployeeDto } from './employee.dto';
import { ProfileDto } from './profile.dto';
import { UserRoleDto } from './user-role.dto';
import { MerchantDto } from './merchant.dto';
import { InvoiceDto } from '../payment/invoice/invoice.dto';
import { TransMasterDto } from '../payment/trans-master.dto';
import { OrderDto } from '../order/order.dto';
import { ProductDto } from '../product/product.dto';
import { AddressDto } from '../core/address.dto';
import { CartDto } from '../cart/cart.dto';
import { TicketDto } from '../core/ticket.dto';

export class UserDto extends BaseDto {
  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  nid: string;

  license: string;

  otp: number;

  password: string;

  location?: string;

  geoLocation?: any;

  gender: Gender;

  dateOfBirth: Date | null;

  lastPasswdGen: Date;

  resetPasswordToken: string;

  resetPasswordValidity: Date;

  address: AddressDto;

  profile: ProfileDto;

  customer: CustomerDto;

  merchant: MerchantDto;

  employee: EmployeeDto;

  affiliator: AffiliatorDto;

  roles: UserRoleDto[];

  products: ProductDto[];

  carts: CartDto[];

  orders: OrderDto[];

  invoices: InvoiceDto[];

  transMasters: TransMasterDto[];

  tickets: TicketDto[];
}
