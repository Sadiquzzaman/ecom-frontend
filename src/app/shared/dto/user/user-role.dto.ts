import {BaseDto} from '../core/base.dto';
import {RoleDto} from './role.dto';
import {UserDto} from './user.dto';
import {ShopDto} from '../shop/shop.dto';

export class UserRoleDto extends BaseDto {
  user: UserDto;

  role: RoleDto;

  shop: ShopDto;
}
