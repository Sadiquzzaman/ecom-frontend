import { Component, Input, OnInit } from '@angular/core';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { ImageService } from '../../../../services/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  image: any = null;

  width = '100%';
  height = '100%';

  type: ImageType = ImageType.SHOP_COVER;

  loader = true;
  loading = true;
  showSrc!: string;

  constructor(private imageService: ImageService) {}

  @Input('imageName') set imageNameData(input: any) {
    this.image = input;
  }

  @Input('width') set widthData(width: string) {
    if (width) {
      this.width = width;
    }
  }

  @Input('height') set heightData(height: string) {
    if (height) {
      this.height = height;
    }
  }

  @Input('type') set typeData(input: ImageType) {
    this.type = input;
  }

  @Input('loader') set loaderData(input: boolean) {
    this.loader = input;
  }

  ngOnInit(): void {
    this.loadImage();
  }

  size = (): { height: string; width: string } => ({
    height: this.height,
    width: this.width,
  });

  loadImage = () => {
    if (
      this.image?.includes('http:') ||
      this.image?.includes('data:') ||
      this.image?.includes('assets')
    ) {
      this.showSrc = this.image;
    } else {
      this.showSrc = this.imageService.loadImage(this.image, this.type);
    }
  };
}
