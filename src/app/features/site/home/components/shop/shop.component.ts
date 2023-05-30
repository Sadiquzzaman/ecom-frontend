import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { fade } from '../../../../../../app/animation/fade.inimation';
import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { HomeService } from '../../home.service';
import { FilterOption } from '../../../../../core/dto/filter-option.dto';
import { Subscription } from 'rxjs';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  animations: [fade],
})
export class ShopComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  promotions: any[] = [];
  searchLocationPageNo = 0;
  keySearchPageNo = 0;
  shopTypes: any[] = [];
  shopsByType: any[] = [];
  followingShops: any[] = [];
  popularShops: any[] = [];
  trendingShops: any[] = [];
  isLocationSearch = false;
  currentType = 1;
  limit = 8;
  throttle = 300;
  scrollDistance = 3;
  isLoading = true;
  currentLocation = { x: 0, y: 0 };
  searchDataAvailableByLocation = true;
  searchDataAvailableByKey = true;
  shopsByLocation: any[] = [];
  shopsByKeySearch: any[] = [];
  isKeySearch = false;
  keySearchData = '';
  locationSearchSubscription: Subscription;
  filterSearchSubscription: Subscription;
  isSearchableSubscription: Subscription;
  locationSearchStatusSubscription: Subscription;
  filterOption: FilterOption = {
    search: '',
    price: '',
    rating: '',
    algorithm: 'latest',
  };

  navbar: any[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly homeService: HomeService,
    private breakpointObserver: BreakpointObserver,
    private readonly loaderService: LoaderService // private readonly token: TokenStorageService
  ) {
    this.loaderService.keySearch.next('Search Shops');
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(({ matches }) => {
          if (matches) {
            return 3;
          }
          return 7;
        })
      )
      .subscribe((value) => {
        this.limit = value;
      });
  }

  ngOnInit(): void {
    this.isLocationSearch = false;
    this.isKeySearch = false;
    this.categories = this.route.snapshot.data?.categories || [];
    // console.log(this.categories);
    this.promotions = this.route.snapshot.data?.promotions || [];
    this.shopTypes = this.route.snapshot.data?.shopTypes || [];
    this.followingShops = this.route.snapshot.data?.followingShops || [];
    this.popularShops = this.route.snapshot.data?.popularShops || [];
    this.trendingShops = this.route.snapshot.data?.trendingShops || [];
    this.loaderService.followingShops.next(this.followingShops);
    this.locationSearch();
    this.globalSearch();
    this.resetSearch();
    this.locationSearchStatusSubscription =
      this.loaderService.locationSearchStatus.subscribe((isEnabled) => {
        this.isLocationSearch = isEnabled;
      });
    // if (this.token.isCustomer()) {
    //   // console.log('customer');
    // } else {
    //   // console.log('not customer');
    // }
    this.initNavBar();
  }

  initNavBar = () => {
    this.navbar.push({ name: 'Shop', link: '' });
    // console.log(this.navbar);
  };

  resetSearch = () => {
    this.isSearchableSubscription = this.loaderService.isSearchable.subscribe(
      (data) => {
        if (data) {
          this.isLocationSearch = false;
          this.isKeySearch = false;
        }
      }
    );
  };

  getShopsByType = (filter: FilterOption) => {
    const availableMore = this.shopTypes[this.currentType - 1];
    if (availableMore) {
      this.isLoading = true;
      this.homeService
        .getByTypePagination(availableMore.id, 1, this.limit, filter)
        .subscribe(
          (res) => {
            if (!res.error) {
              const shops = res?.payload?.data?.shops || [];
              const promotions = res?.payload?.data?.promotions || [];

              this.shopsByType.push({
                ...this.shopTypes[this.currentType - 1],
                shops,
                promotions,
              });
            }
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
    }
  };

  getShopsByKeySearch = (page: number, limit: number, search: string) => {
    if (this.searchDataAvailableByKey) {
      this.isLoading = true;
      this.homeService.getShopByKeyPagination(page, limit, search).subscribe(
        (res) => {
          const { count, data } = res.page;
          if (count < limit) {
            this.searchDataAvailableByKey = false;
          }
          if (!res.error) {
            this.shopsByKeySearch.push(...data);
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.searchDataAvailableByKey = false;
        }
      );
    }
  };

  getShopsByLocation = (
    page: number,
    limit: number,
    lat: number,
    lng: number
  ) => {
    if (this.searchDataAvailableByLocation) {
      this.isLoading = true;
      this.homeService
        .getByShopLocationPagination(page, limit, lat, lng)
        .subscribe(
          (res) => {
            const { count, data } = res.page;
            if (count < limit) {
              this.searchDataAvailableByLocation = false;
            }
            if (!res.error) {
              this.shopsByLocation.push(...data);
              this.loaderService.getShopsByLocationSearch.next(
                this.shopsByLocation
              );
            }
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.searchDataAvailableByLocation = false;
          }
        );
    }
  };

  onScrollDown = (event: Event | EventTarget | any) => {
    ++this.currentType;
    ++this.searchLocationPageNo;
    ++this.keySearchPageNo;
    if (this.isLocationSearch) {
      this.getShopsByLocation(
        this.searchLocationPageNo,
        this.limit,
        this.currentLocation.x,
        this.currentLocation.y
      );
    } else if (this.isKeySearch) {
      this.getShopsByKeySearch(
        this.keySearchPageNo,
        this.limit,
        this.keySearchData
      );
    } else {
      this.getShopsByType(this.filterOption);
    }
  };

  locationSearch() {
    this.locationSearchSubscription =
      this.loaderService.locationSearch.subscribe((data) => {
        if (data && data.x > 0 && data.y > 0) {
          this.currentLocation.x = data.x;
          this.currentLocation.y = data.y;
          this.isLocationSearch = true;
          this.isKeySearch = false;
          this.searchLocationPageNo = 0;
          this.shopsByLocation = [];
          this.getShopsByLocation(
            this.searchLocationPageNo,
            this.limit,
            this.currentLocation.x,
            this.currentLocation.y
          );
        } else {
          this.isLocationSearch = false;
        }
      });
  }

  globalSearch() {
    this.filterSearchSubscription = this.loaderService.filterSearch.subscribe(
      (data) => {
        if (data.search && data.search.length > 2) {
          this.keySearchData = data.search;
          this.isKeySearch = true;
          this.isLocationSearch = false;
          this.keySearchPageNo = 0;
          this.shopsByKeySearch = [];
          this.searchDataAvailableByKey = true;
          this.getShopsByKeySearch(
            this.keySearchPageNo,
            this.limit,
            this.keySearchData
          );
        } else {
          this.isKeySearch = false;
          this.filterOption = data;
          this.currentType = 1;
          this.shopsByType = [];
          this.getShopsByType(this.filterOption);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.filterSearchSubscription) {
      this.filterSearchSubscription.unsubscribe();
    }
    if (this.locationSearchSubscription) {
      this.locationSearchSubscription.unsubscribe();
    }
    if (this.isSearchableSubscription) {
      this.isSearchableSubscription.unsubscribe();
    }
    if (this.locationSearchStatusSubscription) {
      this.locationSearchStatusSubscription.unsubscribe();
    }
  }
}
