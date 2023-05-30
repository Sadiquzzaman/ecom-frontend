import { UserDto } from '../../../../../../../shared/dto/user/user.dto';
import { ResponseDto } from '../../../../../../../shared/dto/reponse/response.dto';
import { TokenStorageService } from '../../../../../../../core/services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../userprofile.service';
import { ImageType } from 'src/app/core/enum/image-type.enum';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user!: UserDto;
  userProfileImageName!: string;
  profileImageType = ImageType.USER_PROFILE;

  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.getuser();
  }

  getuser = () => {
    this.userProfileService
      .getUserProfile(this.token.getUserId())
      .subscribe((res: ResponseDto) => {
        this.user = res?.payload?.data;
        this.userProfileImageName = this.user?.profile?.profileImageUrl;
        console.log(this.user);
      });
  };
}
