import {ThanaDto} from './thana.dto';
import {BaseDto} from './base.dto';

export class ResidentialAreaDto extends BaseDto {
  name: string;

  alias: string;

  thana: ThanaDto;
}
