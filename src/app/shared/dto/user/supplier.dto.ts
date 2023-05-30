import {BaseDto} from '../core/base.dto';
import {NoteDto} from '../core/note.dto';
import {RiskDto} from '../core/risk.dto';

export class SupplierDto extends BaseDto {
  notes: NoteDto[];

  risk: RiskDto;
}
