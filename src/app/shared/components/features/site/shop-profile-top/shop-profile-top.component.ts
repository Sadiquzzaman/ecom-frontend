import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageSnippetDto } from '../../../../../../app/core/dto/image.dto';
import { ImageService } from '../../../../../../app/shared/services/image.service';
import { ImageType } from '../../../../../../app/core/enum/image-type.enum';

@Component({
  selector: 'app-shop-profile-top',
  templateUrl: './shop-profile-top.component.html',
  styleUrls: ['./shop-profile-top.component.scss'],
})
export class ShopProfileTopComponent implements OnInit {
  shop: any = {};
  coverImageType = ImageType.SHOP_COVER;
  profileImageType = ImageType.SHOP_PROFILE_SMALL;
  shopProfileImageName = '';
  selectedProfileFile!: ImageSnippetDto;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.shop = this.route.snapshot.data?.shop;
    this.loadImage(this.route.snapshot.data?.shop);
  }

  catchProductFilter = (e: any): void => {
    console.log(e);
  };

  seeGoogleMap = (): void => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${this.shop.geoLocation.x}, ${this.shop.geoLocation.y}`;
    window.open(`${mapUrl}`, '_blank');
  };

  loadImage = (shop: any): void => {
    this.shopProfileImageName = shop?.shopProfileImage;

    if (
      shop?.shopProfileImage.includes('http:') ||
      shop?.shopProfileImage.includes('assets')
    ) {
      this.selectedProfileFile = new ImageSnippetDto(
        shop?.shopProfileImage,
        new File(['fake'], 'fake.txt')
      );
    } else {
      this.selectedProfileFile = new ImageSnippetDto(
        this.imageService.loadImage(
          shop?.shopProfileImage,
          ImageType.SHOP_PROFILE_SMALL
        ),
        new File(['fake'], 'fake.txt')
      );
    }
  };
}
