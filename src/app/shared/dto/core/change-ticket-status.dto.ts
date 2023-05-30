import { TicketStatus } from '../../enum/ticket-status.enum';

export class ChangeTicketStatusDto {
  ticketId: string;
  status: TicketStatus;
}
