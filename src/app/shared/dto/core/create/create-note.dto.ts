import {NoteDto} from '../note.dto';

export class CreateNoteDto extends NoteDto {
  affiliatorID: string;

  customerID: string;

  employeeID: string;
}
