import {BaseDto} from './base.dto';
import {DistrictDto} from './district.dto';
import {Point} from '../location/point';
import {CountryDto} from './country.dto';

export class StateDto extends BaseDto {
  isoCode: string;

  name: string;

  location: Point;

  country: CountryDto;

  districts: DistrictDto[];
}
