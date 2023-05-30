import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { fade } from '../../../../../../app/animation/fade.inimation';
import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { ProductService } from '../../product.service';
import { FilterOption } from '../../../../../core/dto/filter-option.dto';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [fade],
})
export class ProductComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  flattenCategories: any[] = [];
  productsByCategories: any[] = [];
  wishlist: any[] = [];

  currentCategory = 1;
  limit = 7;
  throttle = 300;
  scrollDistance = 3;

  locationSearchSubscription: any;
  filterSearchSubscription: any;

  promotions: any[] = [];
  searchLocationPageNo = 0;
  keySearchPageNo = 0;
  isLocationSearch = false;
  currentLocation = { x: 0, y: 0 };
  searchDataAvailableByLocation = true;
  searchDataAvailableByKey = true;
  productsByLocation: any[] = [];
  productsByKeySearch: any[] = [];
  popularProducts: any[] = [];
  trendingProducts: any[] = [];
  isKeySearch = false;
  isSearchableSubscription: any;
  searchKey = '';
  filterOption: FilterOption = {
    search: '',
    price: '',
    rating: '',
    algorithm: 'latest',
  };

  promotionList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  promotionList$: Observable<any[]> = this.promotionList.asObservable();
  isLoading$: Observable<Boolean>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private breakpointObserver: BreakpointObserver,
    private loaderService: LoaderService
  ) {
    // this.promotionList.next(this.promotions);
    this.isLoading$ = this.loaderService.isLoading.asObservable();
    this.loaderService.keySearch.next('Search Products');
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
    // this.promotions = this.route.snapshot.data?.promotions || [];
    // this.promotionList.next(this.promotions);

    this.productService.getPromotions().subscribe((res) => {
      if (res?.length) {
        this.promotionList.next(res);
      }
    });

    this.productService.getPopularProducts().subscribe((res) => {
      this.popularProducts = res;
    });

    this.productService.getTrendingProducts().subscribe((res) => {
      this.trendingProducts = res;
    });

    this.productService.getwishlist().subscribe((res) => {
      this.wishlist = res;
      this.loaderService.wishlist.next(this.wishlist);
    });

    this.isLocationSearch = false;
    this.isKeySearch = false;

    LoaderService.categories.subscribe((res) => {
      if (res) {
        this.categories = res;
      } else {
        this.categories = this.route.snapshot.data?.categories;
        LoaderService.categories.next(this.categories);
      }
      // console.log(this.categories);
      this.flatCategories(this.categories);
    });

    // this.wishlist = this.route.snapshot.data?.wishlist;
    // this.promotions = this.route.snapshot.data?.promotions || [];
    // this.popularProducts = this.route.snapshot.data?.popularProducts || [];
    // this.trendingProducts = this.route.snapshot.data?.trendingProducts || [];
    // this.loaderService.wishlist.next(this.wishlist);
    // this.getProductsByCategory(this.filterOption);

    this.locationSearch();
    this.globalSearch();
    this.resetSearch();
  }

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

  flatCategories = (categories: any[]) => {
    categories.forEach((cat) => {
      this.flattenCategories.push(cat);
      if (cat.children.length > 0) {
        cat.children.forEach((children: any) => {
          this.flattenCategories.push(children);
        });
      }
    });
    console.log(this.flattenCategories);
  };

  getProductsByCategory = (filter: FilterOption) => {
    // console.log(this.currentCategory);
    const availableMore: any = this.flattenCategories[this.currentCategory - 1];
    if (availableMore) {
      let id = availableMore.id;
      let obj = this.productsByCategories.find((x) => x.id === id);
      if (!obj) {
        this.loaderService.isLoading.next(true);
        this.productService
          .getByCategoryPagination(availableMore.id, 1, this.limit, filter)
          .subscribe(
            (res) => {
              if (!res.error) {
                const products = res?.payload?.data?.products || [];
                const promotions = res?.payload?.data?.promotions || [];
                // console.log(products);
                // console.log(promotions);
                let id = availableMore.id;
                let obj = this.productsByCategories.find((x) => x.id === id);
                if (!obj) {
                  this.productsByCategories.push({
                    ...availableMore,
                    products,
                    promotions,
                  });
                }
                // console.log(this.productsByCategories);
              }
              this.loaderService.isLoading.next(false);
            },
            (error) => {
              this.loaderService.isLoading.next(false);
            }
          );
      }
      ++this.currentCategory;
    }
  };

  locationSearch() {
    this.loaderService.locationSearch.subscribe((data) => {
      if (data && data.x > 0 && data.y > 0) {
        this.currentLocation.x = data.x;
        this.currentLocation.y = data.y;
        this.isLocationSearch = true;
        this.isKeySearch = false;
        this.searchLocationPageNo = 0;
        this.productsByLocation = [];
        this.getProductsByLocation(
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
          this.searchKey = data.search;
          this.isKeySearch = true;
          this.isLocationSearch = false;
          this.keySearchPageNo = 0;
          this.productsByKeySearch = [];
          this.searchDataAvailableByKey = true;
          console.log(this.searchKey);
          console.log(this.keySearchPageNo);
          console.log(this.limit);
          this.getProductsByKeySearch(
            this.keySearchPageNo,
            this.limit,
            this.searchKey
          );
        } else {
          this.isKeySearch = false;
          if (data.algorithm || data.price || data.rating) {
            this.currentCategory = 1;
            this.productsByCategories = [];
            this.filterOption = data;
            this.getProductsByCategory(this.filterOption);
          }
        }
      }
    );
  }

  getProductsByKeySearch = (page: number, limit: number, search: string) => {
    if (this.searchDataAvailableByKey) {
      this.loaderService.isLoading.next(true);
      this.productService
        .getProductsBySearchKeyPagination(page, limit, search)
        .subscribe(
          (res) => {
            const { count, data } = res.page;
            if (count < limit) {
              this.searchDataAvailableByKey = false;
            }
            if (!res.error) {
              this.productsByKeySearch.push(...data);
            }
            this.loaderService.isLoading.next(false);
            ++this.keySearchPageNo;
          },
          (error) => {
            this.loaderService.isLoading.next(false);
            this.searchDataAvailableByKey = false;
          }
        );
    }
  };

  getProductsByLocation = (
    page: number,
    limit: number,
    lat: number,
    lng: number
  ) => {
    if (this.searchDataAvailableByLocation && lat > 0 && lng > 0) {
      this.loaderService.isLoading.next(true);
      this.productService
        .getByProductLocationPagination(page, limit, lat, lng)
        .subscribe(
          (res) => {
            const { count, data } = res.page;
            if (count < limit) {
              this.searchDataAvailableByLocation = false;
            }
            if (!res.error) {
              this.productsByLocation.push(...data);
            }
            this.loaderService.isLoading.next(false);
            // ++this.searchLocationPageNo;
          },
          (error) => {
            this.loaderService.isLoading.next(false);
            this.searchDataAvailableByLocation = false;
          }
        );
    }
  };

  onScrollDown = (ev: Event | EventTarget | any) => {
    if (this.isLocationSearch) {
      this.getProductsByLocation(
        this.searchLocationPageNo,
        this.limit,
        this.currentLocation.x,
        this.currentLocation.y
      );
    } else if (this.isKeySearch) {
      this.getProductsByKeySearch(
        this.keySearchPageNo,
        this.limit,
        this.searchKey
      );
    } else {
      this.getProductsByCategory(this.filterOption);
    }
  };

  ngOnDestroy(): void {
    if (this.locationSearchSubscription) {
      this.locationSearchSubscription.unsubscribe();
    }
    if (this.filterSearchSubscription) {
      this.filterSearchSubscription.unsubscribe();
    }
    if (this.isSearchableSubscription) {
      this.isSearchableSubscription.unsubscribe();
    }
  }
}
