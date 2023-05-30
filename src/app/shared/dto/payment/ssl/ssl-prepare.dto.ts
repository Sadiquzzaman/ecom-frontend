import {BaseDto} from '../../core/base.dto';
import {Bool} from '../../../enum/bool.enum';
import {SslShippingMethodEnum} from '../../../enum/ssl-shipping-method.enum';
import {SslProductProfileEnum} from '../../../enum/ssl-product-profile.enum';
import {SslPrepareProductDto} from './ssl-prepare-product.dto';

export class SslPrepareDto extends BaseDto {
  tran_id: string;

  success_url: string;

  fail_url: string;

  cancel_url: string;

  ipn_url: string;

  multi_card_name: string;

  allowed_bin: string;

  total_amount: number;

  emi_option: Bool;

  emi_max_inst_option: number;

  emi_selected_inst: number;

  emi_allow_only: Bool;

  cus_name: string;

  cus_email: string;

  cus_add1: string;

  cus_add2: string;

  cus_city: string;

  cus_state: string;

  cus_postcode: string;

  cus_country: string;

  cus_phone: string;

  cus_fax: string;

  shipping_method: SslShippingMethodEnum;

  num_of_item: number;

  ship_name: SslShippingMethodEnum;

  ship_add1: string;
  ship_add2: string;

  ship_city: string;

  ship_state: string;

  ship_postcode: string;

  ship_country: string;

  product_name: string;

  product_category: string;

  product_profile: SslProductProfileEnum;

  hours_till_departure: string;

  flight_type: string;

  pnr: string;

  journey_from_to: string;

  third_party_booking: Bool;

  hotel_name: string;

  length_of_stay: string;

  check_in_time: string;

  hotel_city: string;

  product_type: string;

  topup_number: string;

  country_topup: string;

  cart: SslPrepareProductDto[];

  product_amount: number;

  vat: number;

  discount_amount: number;

  convenience_fee: number;

  value_a: string;

  value_b: string;

  value_c: string;

  value_d: string;
}
