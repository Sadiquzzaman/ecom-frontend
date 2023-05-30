import {BaseDto} from './base.dto';
import {CountryDto} from './country.dto';
import {DistrictDto} from './district.dto';
import {StateDto} from './state.dto';
import {ThanaDto} from './thana.dto';

export class AddressDto extends BaseDto {
  alias: string;

  lastname: string;

  phone: string;

  firstname: string;

  address: string;

  country: CountryDto;

  state: StateDto;

  district: DistrictDto;

  thana: ThanaDto;
}
