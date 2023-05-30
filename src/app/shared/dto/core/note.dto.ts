import {BaseDto} from './base.dto';
import {MerchantDto} from '../user/merchant.dto';
import {AffiliatorDto} from '../user/affiliator.dto';
import {CustomerDto} from '../user/customer.dto';
import {SupplierDto} from '../user/supplier.dto';
import {EmployeeDto} from '../user/employee.dto';

export class NoteDto extends BaseDto {
  note: string;

  merchant: MerchantDto;

  affiliator: AffiliatorDto;

  customer: CustomerDto;

  employee: EmployeeDto;

  supplier: SupplierDto;
}
