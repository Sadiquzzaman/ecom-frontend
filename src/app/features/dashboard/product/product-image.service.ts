import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from '../../../core/services/api-config.service';
import {MicroserviceURL} from '../../../core/enum/microservices.enum';
import {Observable} from 'rxjs';

@Injectable()
export class ProductImageService {
  imageUrl = this.apiConfigService.getUrl(MicroserviceURL.IMAGE) + `image-upload`;

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {
  }

  uploadProductCover = (filename: string) => this._httpClient.post(`${this.imageUrl}/product`, {filename});

  uploadProductCoverRedis = (image: File): Observable<any> => {
    const formData = new FormData();
    formData.append('image', image);
    return this._httpClient.post(`${this.imageUrl}/product-redis`, formData);
  };

  uploadProductGallery = (filename: string) => this._httpClient.post(`${this.imageUrl}/product/gallery`, {filename});

  uploadProductGalleryRedis = (image: File): Observable<any> => {
    const formData = new FormData();
    formData.append('image', image);
    return this._httpClient.post(`${this.imageUrl}/product-redis/gallery`, formData);
  };
}
