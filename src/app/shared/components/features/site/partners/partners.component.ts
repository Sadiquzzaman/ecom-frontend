import {Component} from '@angular/core';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent {
  images: any[] = [
    {
      src: '../../../../../assets/images/partner_image.png',
      alt: 'Partner',
    },
    {
      src: '../../../../../assets/images/partner_image.png',
      alt: 'Partner',
    },
    {
      src: '../../../../../assets/images/partner_image.png',
      alt: 'Partner',
    },
    {
      src: '../../../../../assets/images/partner_image.png',
      alt: 'Partner',
    },
    {
      src: '../../../../../assets/images/partner_image.png',
      alt: 'Partner',
    },
    {
      src: '../../../../../assets/images/partner_image.png',
      alt: 'Partner',
    },
  ];
}
