import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from '../../stock.service';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  products: any[] = [];
  isAdmin = true;

  displayedColumns: string[] = [
    // 'seriall no.',
    // 'image',
    'category',
    'shop',
    'name',
    'reference',
    'price',
    'quantity',
    // 'reserved',
    'sold',
  ];
  dataSource: any[] = [];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };
  pageSerial = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  coverImageType = ImageType.SHOP_COVER;
  profileImageType = ImageType.SHOP_PROFILE_SMALL;

  entity = '';
  merchantId: string = '';
  secondEntity = 'shop';
  shopId: string = '';
  dropdownName = 'Product Category';
  productCategoryId: string = '';
  textBoxName = 'Product Name';
  productName: string = '';

  constructor(
    private readonly stockService: StockService,
    public readonly token: TokenStorageService,
    private readonly router: Router
  ) {
    if (this.token.isAdmin()) {
      this.entity = 'merchant';
      this.displayedColumns.splice(0, 0, 'merchant');
    } else {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
      this.isAdmin = false;
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.showAll();
  }

  showAll = () => {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.stockService.getStockInfo(
            page,
            limit,
            sort,
            order,
            this.isAdmin,
            this.productName,
            this.productCategoryId,
            this.shopId,
            this.merchantId
          );
        }),
        map((res) => {
          console.log(this.paginator.pageIndex);
          console.log(this.paginator.pageSize);
          this.pageSerial =
            this.paginator.pageIndex * this.paginator.pageSize + 1;
          const { count, data } = res.page;
          this.pagination.isLoading = false;
          this.pagination.totalCount = count;
          return data;
        }),
        catchError(() => {
          this.pagination.isLoading = false;
          return of([]);
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.dataSource = data;
      });
  };

  submittedSearch = ($event: any) => {
    // console.log($event);
    const { entityId, secondEntityId, firstText, dropdownId } = $event;
    this.merchantId = entityId;
    this.shopId = secondEntityId;
    this.productName = firstText;
    this.productCategoryId = dropdownId;
    this.showAll();
  };
}
