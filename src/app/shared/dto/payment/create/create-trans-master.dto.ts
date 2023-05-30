import {TransMasterDto} from '../trans-master.dto';

export class CreateTransMasterDto extends TransMasterDto {
  invoiceID: string;

  userID: string;
}
