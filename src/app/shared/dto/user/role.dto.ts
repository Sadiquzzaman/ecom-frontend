import {BaseDto} from '../core/base.dto';
import {UserRoleDto} from './user-role.dto';

export class RoleDto extends BaseDto {
  role: string;

  description: string;

  users: UserRoleDto[];
}
