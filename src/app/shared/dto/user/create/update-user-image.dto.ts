import { UserDto } from '../user.dto';

export class UpdateUserImageDto extends UserDto {
  profileImageNameNew: File;
}
