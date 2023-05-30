import {BaseDto} from './base.dto';
import {Bool} from '../../enum/bool.enum';

export class ContactUsDto extends BaseDto {
  email: string;

  subject: string;

  message: string;

  isSms: Bool;

  isEmail: Bool;

  phone: string;
}
