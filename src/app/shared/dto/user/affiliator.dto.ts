import {BaseDto} from '../core/base.dto';
import {NoteDto} from '../core/note.dto';
import {RiskDto} from '../core/risk.dto';

export class AffiliatorDto extends BaseDto {
  baseFee: number;

  percentFee: number;

  clickFee: number;

  notes: NoteDto[];

  risk: RiskDto;
}
