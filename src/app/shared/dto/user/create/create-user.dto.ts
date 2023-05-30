import { UserType } from '../../../enum/user-type.enum';
import { UserDto } from '../user.dto';

export class CreateUserDto extends UserDto {
  type: UserType;
  district: string;
  thana: string;
  addressPlain: string;
  profileImageUrl: string;
}
