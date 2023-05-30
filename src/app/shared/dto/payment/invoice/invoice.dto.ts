import {InvoiceStatus} from '../../../enum/invoice-status.enum';
import { AddressDto } from '../../core/address.dto';
import {BaseDto} from '../../core/base.dto';
import {UserDto} from '../../user/user.dto';
import {InvoiceDetailsDto} from './invoice-details.dto';

export class InvoiceDto extends BaseDto {
  dateApplied: Date | null;

  datePaid: Date | null;

  status: InvoiceStatus;

  user: UserDto;

  invoiceDetails: InvoiceDetailsDto;

  shippingAddress: AddressDto;
}
