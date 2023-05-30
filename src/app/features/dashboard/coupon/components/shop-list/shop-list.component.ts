// import {
//   CdkDragDrop,
//   moveItemInArray,
//   transferArrayItem,
// } from '@angular/cdk/drag-drop';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { ConfirmDialogComponent } from '../../../../../shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
// import {ShopService} from '../../shop.service';
import { CouponService } from '../../coupon.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
})
export class ShopListComponent implements AfterViewInit {
  allShops: any[] = [];
  allProducts: any[] = [];
  allCategories: any[] = [];
  allThanas: any[] = [];
  allUsers: any[] = [];

  public searchForm: any = {
    shopName: '',
  };

  shopPagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  productPagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  categoryPagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  thanaPagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  userPagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('shopPaginator') shopPaginator: MatPaginator;
  @ViewChild('productPaginator') productPaginator: MatPaginator;
  @ViewChild('categoryPaginator') categoryPaginator: MatPaginator;
  @ViewChild('thanaPaginator') thanaPaginator: MatPaginator;
  @ViewChild('userPaginator') userPaginator: MatPaginator;

  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;
  shopCoverImageType = ImageType.SHOP_COVER;
  shopProfileImageType = ImageType.SHOP_PROFILE_SMALL;

  productCoverImageType = ImageType.PRODUCT_BIG;
  productProfileImageType = ImageType.PRODUCT_SMALL;

  categoryImage = ImageType.CATEGORY;
  userImage = ImageType.USER_PROFILE;

  constructor(private readonly couponService: CouponService) {}

  ngAfterViewInit(): void {
    this.showAllShop();
    this.showAllProducts();
    this.showAllCategories();
    this.showAllThanas();
    this.showAllUsers();
  }

  showAllShop = () => {
    this.sort.sortChange.subscribe(() => (this.shopPaginator.pageIndex = 0));

    merge(this.sort.sortChange, this.shopPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.shopPagination.isLoading = true;
          const page = this.shopPaginator.pageIndex + 1;
          const limit = this.shopPaginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.couponService.getAllShopByPagination(
            page,
            limit,
            sort,
            order
          );
        }),
        map((res) => {
          const { count, data } = res.page;
          this.shopPagination.isLoading = false;
          this.shopPagination.totalCount = count;
          return data;
        }),
        catchError(() => {
          this.shopPagination.isLoading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.allShops = data;
        // console.log('shops', this.allShops);
      });
  };

  showAllProducts = () => {
    this.sort.sortChange.subscribe(() => (this.productPaginator.pageIndex = 0));

    merge(this.sort.sortChange, this.productPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.productPagination.isLoading = true;
          const page = this.productPaginator.pageIndex + 1;
          const limit = this.productPaginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.couponService.getAllProductByPagination(
            page,
            limit,
            sort,
            order
          );
        }),
        map((res) => {
          const { count, data } = res.page;
          this.productPagination.isLoading = false;
          this.productPagination.totalCount = count;
          return data;
        }),
        catchError(() => {
          this.productPagination.isLoading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.allProducts = data;
        // console.log('products', this.allProducts);
      });
  };

  showAllCategories = () => {
    this.sort.sortChange.subscribe(
      () => (this.categoryPaginator.pageIndex = 0)
    );

    merge(this.sort.sortChange, this.categoryPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.categoryPagination.isLoading = true;
          const page = this.categoryPaginator.pageIndex + 1;
          const limit = this.categoryPaginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.couponService.getAllCategoryByPagination(
            page,
            limit,
            sort,
            order
          );
        }),
        map((res) => {
          const { count, data } = res.page;
          this.categoryPagination.isLoading = false;
          this.categoryPagination.totalCount = count;
          return data;
        }),
        catchError(() => {
          this.categoryPagination.isLoading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.allCategories = data;
        // console.log('category', this.allCategories);
      });
  };

  showAllThanas = () => {
    this.sort.sortChange.subscribe(() => (this.thanaPaginator.pageIndex = 0));

    merge(this.sort.sortChange, this.thanaPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.thanaPagination.isLoading = true;
          const page = this.thanaPaginator.pageIndex + 1;
          const limit = this.thanaPaginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.couponService.getAllThanaByPagination(
            page,
            limit,
            sort,
            order
          );
        }),
        map((res) => {
          const { count, data } = res.page;
          this.thanaPagination.isLoading = false;
          this.thanaPagination.totalCount = count;
          return data;
        }),
        catchError(() => {
          this.thanaPagination.isLoading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.allThanas = data;
        // console.log('Thanas', this.allThanas);
      });
  };

  showAllUsers = () => {
    this.sort.sortChange.subscribe(() => (this.userPaginator.pageIndex = 0));

    merge(this.sort.sortChange, this.userPaginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.userPagination.isLoading = true;
          const page = this.userPaginator.pageIndex + 1;
          const limit = this.userPaginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.couponService.getAllUserByPagination(
            page,
            limit,
            sort,
            order,
            ['CUSTOMER_ROLE']
          );
        }),
        map((res) => {
          const { count, data } = res.page;
          this.userPagination.isLoading = false;
          this.userPagination.totalCount = count;
          return data;
        }),
        catchError(() => {
          this.userPagination.isLoading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        this.allUsers = data;
        // console.log('Users', this.allUsers);
      });
  };

  selectedShops: any[] = [];
  selectedProducts: any[] = [];
  selectedCategories: any[] = [];
  selectedThanas: any[] = [];
  selectedUsers: any[] = [];

  shopDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      localStorage.removeItem('cdk-shop-list');
      if (event.container.id === 'cdk-drop-list-1') {
        this.selectedShops = event.container.data;
      }
      localStorage.setItem(
        'cdk-shop-list',
        JSON.stringify(
          this.selectedShops.map((shop) => {
            return shop['id'];
          })
        )
      );
    }
    console.log(
      this.selectedShops.map((shop) => {
        return shop['id'];
      })
    );
  }

  productDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // console.log({ ffff: event.container.data });
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(event.container);
      localStorage.removeItem('cdk-product-list');
      if (event.container.id === 'cdk-drop-list-1') {
        this.selectedProducts = event.container.data;
      }
      localStorage.setItem(
        'cdk-product-list',
        JSON.stringify(
          this.selectedProducts.map((product) => {
            return product['id'];
          })
        )
      );
    }
    console.log(
      this.selectedProducts.map((product) => {
        return product['id'];
      })
    );
  }

  categoryDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      localStorage.removeItem('cdk-category-list');
      if (event.container.id === 'cdk-drop-list-1') {
        this.selectedCategories = event.container.data;
      }
      localStorage.setItem(
        'cdk-category-list',
        JSON.stringify(
          this.selectedCategories.map((category) => {
            return category['id'];
          })
        )
      );
    }
    console.log(
      this.selectedCategories.map((category) => {
        return category['id'];
      })
    );
  }

  thanaDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      localStorage.removeItem('cdk-thana-list');
      if (event.container.id === 'cdk-drop-list-1') {
        this.selectedThanas = event.container.data;
      }
      localStorage.setItem(
        'cdk-thana-list',
        JSON.stringify(
          this.selectedThanas.map((thana) => {
            return thana['id'];
          })
        )
      );
    }
    console.log(
      this.selectedThanas.map((thana) => {
        return thana['id'];
      })
    );
  }

  userDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      localStorage.removeItem('cdk-user-list');
      if (event.container.id === 'cdk-drop-list-1') {
        this.selectedUsers = event.container.data;
      }
      localStorage.setItem(
        'cdk-user-list',
        JSON.stringify(
          this.selectedUsers.map((user) => {
            return user['id'];
          })
        )
      );
    }
    console.log(
      this.selectedUsers.map((user) => {
        return user['id'];
      })
    );
  }
}
