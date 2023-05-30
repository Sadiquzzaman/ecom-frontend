import {BaseDto} from '../core/base.dto';
import {ShopDto} from '../shop/shop.dto';
import {NoteDto} from '../core/note.dto';
import {RiskDto} from '../core/risk.dto';

export class MerchantDto extends BaseDto {
  shops: ShopDto[];

  notes: NoteDto[];

  risk: RiskDto;
}
