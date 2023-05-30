import {BaseDto} from './base.dto';

export class CurrencyDto extends BaseDto {
  name: string;

  isoCode: string;

  numericIsoCode: string;

  symbol: string;

  conversionRate: number;
}
