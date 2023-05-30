import { UserDto } from '../user/user.dto';
import { BaseDto } from './base.dto';
import { TicketDepartmentDto } from './ticket-department.dto';

export class TicketDto extends BaseDto {
  subject: string;

  issueDetails: string;

  department: TicketDepartmentDto;

  user: UserDto;
}
