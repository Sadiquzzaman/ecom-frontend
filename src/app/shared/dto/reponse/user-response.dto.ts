import {CustomUserRoleDto} from '../user/custom-user-role.dto';

export class UserResponseDto {
  userId: string;
  userName: string;
  phone: string;
  roles: CustomUserRoleDto[];
  accessToken: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isCustomer: boolean;
  isMerchant: boolean;
  isUser: boolean;
  isAffiliator: boolean;
}
