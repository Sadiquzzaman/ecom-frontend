import { TicketDto } from '../ticket.dto';

export class CreateTicketDto extends TicketDto {
  departmentId: string;
}
