import {BaseDto} from '../core/base.dto';
import {Bool} from '../../enum/bool.enum';
import {InvoiceDto} from './invoice/invoice.dto';
import {SslValidateDto} from './ssl/ssl-validate.dto';
import {UserDto} from '../user/user.dto';

export class TransMasterDto extends BaseDto {
  totalAmount: number;

  credit: Bool;

  invoice: InvoiceDto;

  sslValidate: SslValidateDto;

  user: UserDto;
}
