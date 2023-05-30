import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterOption } from '../dto/filter-option.dto';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  noLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  locationSearchStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isSearchable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  followingShops: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  wishlist: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  locationSearch: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  getShopsByLocationSearch: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  shippingAddress: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  keySearch: BehaviorSubject<string> = new BehaviorSubject<string>(
    'Search Shops'
  );
  filterSearch: BehaviorSubject<FilterOption> =
    new BehaviorSubject<FilterOption>({
      search: '',
      price: '',
      rating: '',
      algorithm: 'latest',
    });
  static categories: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  static selectedComponent: string = 'product'; // product or shop
  static unselectedComponent: string = 'shop'; // shop or product
}
