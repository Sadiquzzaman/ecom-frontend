import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MicroserviceURL } from '../../../../../../app/core/enum/microservices.enum';
import { ApiConfigService } from '../../../../../core/services/api-config.service';
import { ResponseDto } from '../../../../../shared/dto/reponse/response.dto';
import { CreateUserDto } from '../../../../../shared/dto/user/create/create-user.dto';

@Injectable()
export class UserProfileService {
  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'users/';
  imageUrl =
    this.apiConfigService.getUrl(MicroserviceURL.IMAGE) + 'image-upload';
  constructor(
    private readonly http: HttpClient,
    private readonly apiConfigService: ApiConfigService
  ) {}

  getUserProfile(id: string): Observable<ResponseDto> {
    return this.http.get(
      this.baseUrl + id + '/profile'
    ) as Observable<ResponseDto>;
  }

  updateUser(id: string, user: CreateUserDto): Observable<ResponseDto> {
    return this.http.put(this.baseUrl + id, user) as Observable<ResponseDto>;
  }

  uploadProfileImageRedis = (image: File): Observable<any> => {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(`${this.imageUrl}/user/profileimage`, formData);
  };

  saveProfileImage = (imageName: string): Observable<any> => {
    return this.http.post(`${this.imageUrl}/user/save-profile-image`, {
      filename: imageName,
    });
  };
}
