import {DistrictDto} from './district.dto';
import {ResidentialAreaDto} from './residential-area.dto';
import {BaseDto} from './base.dto';
import {Point} from '../location/point';

export class ThanaDto extends BaseDto {
  isoCode: string;

  name: string;

  location: Point;

  district: DistrictDto;

  residentialAreas: ResidentialAreaDto[];
}
