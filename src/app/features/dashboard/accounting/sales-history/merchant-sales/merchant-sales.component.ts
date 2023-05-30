import { HttpResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  AfterViewChecked,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { AccountingService } from '../../accounting.service';

@Component({
  selector: 'app-merchant-sales',
  templateUrl: './merchant-sales.component.html',
  styleUrls: ['./merchant-sales.component.scss'],
})
export class MerchantSalesComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  displayedColumns: string[] = [
    'updatedAt',
    'createAt',
    'status',
    'merchantInvoiceTotal',
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
  entity = '';
  isAdmin = true;

  constructor(
    private accountingService: AccountingService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (!this.token.isAdmin()) {
      this.isAdmin = false;
    } else {
      this.entity = 'merchant';
      this.displayedColumns.splice(2, 0, 'merchant');
      this.displayedColumns.splice(5, 0, 'orderId');
    }
  }

  initForm = () => {
    this.entityId = '';
    this.fromDate = '';
    this.toDate = '';
  };

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  showAll = () => {
    merge(
      this.paginator.page,
      this.sort.sortChange.pipe(tap(() => (this.paginator.pageIndex = 0)))
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          if (this.isAdmin) {
            return this.accountingService.adminMerchantInvpagination(
              page,
              limit,
              sort,
              order,
              this.entityId,
              this.fromDate,
              this.toDate
            );
          } else {
            return this.accountingService.merchantInvoicePagination(
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
      this.accountingService.merchantSalesFileForAdmin(
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
      this.accountingService.merchantSalesFileForMerchant(
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
