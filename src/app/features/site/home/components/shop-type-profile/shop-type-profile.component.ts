import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { HomeService } from '../../home.service';
import { FilterOption } from '../../../../../core/dto/filter-option.dto';

@Component({
  selector: 'app-shop-type-profile',
  templateUrl: './shop-type-profile.component.html',
  styleUrls: ['./shop-type-profile.component.scss'],
})
export class ShopTypeProfileComponent implements OnInit {
  shopType: any = {};
  shops: any[] = [];

  shopTypeImageType = ImageType.CATEGORY;

  currentPage = 1;
  limit = 8;
  throttle = 300;
  scrollDistance = 3;
  isLoading = true;
  totalCount = 0;
  filter: FilterOption = {
    search: '',
    price: '',
    rating: '',
    algorithm: 'latest',
  };

  navbar: any[] = [];

  constructor(
    private readonly homeService: HomeService,
    private readonly route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(({ matches }) => {
          if (matches) {
            return 3;
          }
          return 8;
        })
      )
      .subscribe((value) => {
        this.limit = value;
      });
  }

  ngOnInit(): void {
    this.shopType = this.route.snapshot.data?.type;
    console.log(this.shopType);
    this.getShopsByType(this.filter);

    this.initNavBar();
  }

  initNavBar = () => {
    console.log(this.shopType);
    this.navbar.push({ name: 'Shop', link: '/shop' });
    this.navbar.push({
      name: this.shopType.name,
      link: '',
    });

    console.log(this.navbar);
  };

  getShopsByType = (filter: FilterOption) => {
    this.isLoading = true;
    this.homeService
      .getByTypePagination(
        this.shopType.id,
        this.currentPage,
        this.limit,
        filter
      )
      .subscribe(
        (res) => {
          if (!res.error) {
            const shops = res?.payload?.data.shops || [];
            this.shops.push(...shops);
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  };

  onScrollDown = (ev: Event | EventTarget | any) => {
    ++this.currentPage;
    this.getShopsByType(this.filter);
  };
}
