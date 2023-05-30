import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import { ResponseService } from '../../../../../shared/services/response.service';

@Component({
  selector: 'app-assign-shop',
  templateUrl: './assign-shop.component.html',
  styleUrls: ['./assign-shop.component.scss'],
})
export class AssignShopComponent implements OnInit, OnDestroy {
  isLoading = false;

  btnLabel = 'SUBMIT';

  isShopManagerSearching = false;
  shopManagerFiltering: FormControl = new FormControl();
  shopManagerOptions: Array<{ id: string; name: string }> = [];
  filteredShopManagerOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  isShopSearching = false;
  shopFiltering: FormControl = new FormControl();
  shopOptions: Array<{ id: string; name: string }> = [];
  filteredShopOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  shopAssignForm!: FormGroup;
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly token: TokenStorageService,
    private readonly rS: ResponseService
  ) {
    // console.log('ccc');
    if (!this.token.isAdmin()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe();
  }

  ngOnInit(): void {
    // console.log('aaa');
    this.shopManagerOptions = this.route.snapshot.data?.shopManagers;
    this.filteredShopManagerOptions.next(this.shopManagerOptions);

    this.shopOptions = this.route.snapshot.data?.shops;
    this.filteredShopOptions.next(this.shopOptions);

    this.initForm();
    this.filterShop();
    this.filterShopManager();
  }

  initForm = () => {
    this.shopAssignForm = new FormGroup({
      shopManager: new FormControl('', Validators.required),
      shops: new FormControl('', Validators.required),
    });
  };

  /******************* filter *************************/
  filterShop = () => {
    this.shopFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isShopSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.shopOptions) {
            return [];
          }
          return this.shopOptions.filter(
            (shop) => shop.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isShopSearching = false;
          this.filteredShopOptions.next(filtered);
        },
        () => {
          this.isShopSearching = false;
        }
      );
  };

  filterShopManager = () => {
    this.shopManagerFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isShopManagerSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.shopManagerOptions) {
            return [];
          }
          return this.shopManagerOptions.filter(
            (shopManager) =>
              shopManager.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isShopManagerSearching = false;
          this.filteredShopManagerOptions.next(filtered);
        },
        () => {
          this.isShopManagerSearching = false;
        }
      );
  };

  save = () => {
    if (this.shopAssignForm.valid) {
      this.isLoading = true;

      this.productService
        .adminProductCcreate(this.shopAssignForm.value)
        .subscribe((res) => {
          if (res.error && res.error.hasOwnProperty('error')) {
            res = res.error;
          }

          if (!res.error && res.payload) {
            this.isLoading = false;
            this.shopAssignForm.reset();
            this.rS.fire(res);
            this.router.navigate(['/dashboard/shop/assign-shop']);
          } else {
            this.isLoading = false;
            this.rS.fire(res);
          }
        });
    } else {
      this.rS.message('Please fill all the fields!!');
    }
  };
}
