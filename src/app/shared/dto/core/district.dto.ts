import {ThanaDto} from './thana.dto';
import {BaseDto} from './base.dto';
import {StateDto} from './state.dto';
import {Point} from '../location/point';

export class DistrictDto extends BaseDto {
  isoCode: string;

  name: string;

  location: Point;

  state: StateDto;

  thanas: ThanaDto[];
}
