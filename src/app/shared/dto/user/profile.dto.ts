import {BaseDto} from '../core/base.dto';

export class ProfileDto extends BaseDto {
  coverImageUrl: string;

  profileImageUrl: string;

  title: string;

  description: string;

  presentAddress: string;

  permanentAddress: string;

  companyAddress: string;
}
