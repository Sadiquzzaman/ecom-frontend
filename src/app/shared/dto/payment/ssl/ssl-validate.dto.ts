import {BaseDto} from '../../core/base.dto';

export class SslValidateDto extends BaseDto {
  status: string;

  tran_date: Date | null;

  tran_id: string;

  val_id: string;

  amount: string;

  store_amount: string;

  card_type: string;

  card_no: string;

  bank_tran_id: string;

  card_issuer: string;

  card_brand: string;

  card_issuer_country: string;

  card_issuer_country_code: string;

  currency_type: string;

  currency_amount: string;

  verify_sign: string;

  verify_key: string;

  risk_level: string;

  risk_title: string;

  value_a: string;

  value_b: string;

  value_c: string;

  value_d: string;
}
