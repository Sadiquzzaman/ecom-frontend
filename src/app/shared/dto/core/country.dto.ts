import {Bool} from '../../enum/bool.enum';
import {BaseDto} from './base.dto';
import {CurrencyDto} from './currency.dto';
import {StateDto} from './state.dto';
import {Point} from '../location/point';

export class CountryDto extends BaseDto {
  name: string;

  isoCode: string;

  callPrefix: number;

  location: Point;

  hasStates: Bool;

  stateAlies: string;

  hasZipCode: Bool;

  zipCodeFormat: string;

  currency: CurrencyDto;

  states: StateDto[];
}
