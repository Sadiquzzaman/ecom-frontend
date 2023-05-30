import { Router } from '@angular/router';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
  OnInit,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { AccountingService } from '../../accounting.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-shop-sales',
  templateUrl: './shop-sales.component.html',
  styleUrls: ['./shop-sales.component.scss'],
})
export class ShopSalesComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  displayedColumns: string[] = [
    'updatedAt',
    'createAt',
    'shop',
    'status',
    'shopInvoiceTotal',
    // 'orderId',
    'InvoiceId',
  ];
  dataSource: any[] = [];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  entityId: string;
  fromDate: string;
  toDate: string;
  entity = 'shop';
  isAdmin = true;

  /******************* image ************************/

  constructor(
    private accountingService: AccountingService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (!(this.token.isAdmin() || this.token.isShopManager())) {
      this.isAdmin = false;
    } else {
      this.displayedColumns.splice(5, 0, 'orderId');
    }
  }

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  initForm = () => {
    this.entityId = '';
    this.fromDate = '';
    this.toDate = '';
  };

  showAll = () => {
    merge(
      this.paginator.page,
      this.sort.sortChange.pipe(tap(() => (this.paginator.pageIndex = 0)))
    )
      .pipe(
        startWith({}),
        switchMap((x) => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          if (this.isAdmin) {
            return this.accountingService.adminShopInvPagination(
              page,
              limit,
              sort,
              order,
              this.entityId,
              this.fromDate,
              this.toDate
            );
          } else {
            return this.accountingService.merchantShopInvoicePagination(
              page,
              limit,
              sort,
              order,
              this.entityId,
              this.fromDate,
              this.toDate
            );
          }
        }),
        map((res) => {
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
        //console.log(data);
        this.dataSource = data;
      });
  };

  goToOrderDetails = (id: string) => {
    this.router.navigate(['/dashboard/order/details/' + id]);
  };

  goToInvoiceDetails = (id: string) => {
    this.router.navigate(['/dashboard/order/invoice/' + id]);
  };

  submittedSearch = ($event: any) => {
    // console.log($event);
    const { entityId, fromDate, toDate } = $event;
    this.entityId = entityId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.showAll();
  };

  exportFile = (fileExtension: string) => {
    //this.pagination.isLoading = true;
    const page = this.paginator.pageIndex + 1;
    const limit = this.paginator.pageSize;
    const sort = this.sort?.active || 'updatedAt';
    const order = this.sort?.direction.toUpperCase() || 'DESC';

    if (this.isAdmin) {
      this.accountingService.shopSalesFileForAdmin(
        page,
        limit,
        sort,
        order,
        this.entityId,
        this.fromDate,
        this.toDate,
        fileExtension
      );
    } else {
      this.accountingService.shopSalesFileForMerchant(
        page,
        limit,
        sort,
        order,
        this.entityId,
        this.fromDate,
        this.toDate,
        fileExtension
      );
    }
  };
}
