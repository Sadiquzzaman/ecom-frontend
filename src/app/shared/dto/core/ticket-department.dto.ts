import { BaseDto } from './base.dto';
import { TicketDto } from './ticket.dto';

export class TicketDepartmentDto extends BaseDto {
  name: string;

  tickets: TicketDto[];
}
