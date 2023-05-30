import {BaseDto} from '../core/base.dto';
import {NoteDto} from '../core/note.dto';
import {RiskDto} from '../core/risk.dto';
import {AddressDto} from '../core/address.dto';

export class CustomerDto extends BaseDto {
  outstandingAllowAmount: number;

  maxPaymentDays: number;

  notes: NoteDto[];

  risk: RiskDto;

  address: AddressDto;

  shippingAddress: AddressDto[];
}
