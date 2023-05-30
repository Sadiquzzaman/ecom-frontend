import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import { RefundService } from './../../refund.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { ResponseService } from 'src/app/shared/services/response.service';
import { ApprovedDetailsComponent } from 'src/app/shared/components/features/dashboard/approved-details/approved-details.component';

@Component({
  selector: 'app-refund-request',
  templateUrl: './refund-request.component.html',
  styleUrls: ['./refund-request.component.scss'],
})
export class RefundRequestComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'sl',
    'createAt',
    // 'refundRequestQuantity',
    // 'product',
    'totalRefundableAmount',
    'description',
    // 'customer',
  ];
  dataSource: any[] = [];
  refundId: string;
  refundStatus: string;

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
  entity = 'customer';
  isAdmin = true;

  constructor(
    private readonly refundService: RefundService,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
    private readonly rS: ResponseService,
    public readonly token: TokenStorageService
  ) {
    if (this.token.isAdmin()) {
      this.displayedColumns.push('customer', 'action');
    } else if (this.token.isCustomer()) {
      this.displayedColumns.push('assignStatus', 'details');
    }
  }

  ngOnInit(): void {
    if (!this.token.isAdmin()) {
      this.isAdmin = false;
      // this.router.navigate([this.token.DASHBOARD]);
    }
  }

  ngAfterViewInit(): void {
    this.showAll();
  }

  showAll = () => {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        tap(() => {
          console.log(typeof this.isAdmin);
        }),
        switchMap(() => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';
          const refundStatus = '0';
          const assignStatus = 0;

          console.log(typeof this.isAdmin);

          return this.refundService.refundRequestList(
            page,
            limit,
            sort,
            order,
            refundStatus,
            assignStatus,
            this.isAdmin,
            this.entityId,
            this.fromDate,
            this.toDate
          );
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
      .subscribe((data) => (console.log(data), (this.dataSource = data)));
  };

  goToReturnRequestDetails = (refundID: string, assignStatus: number = 0) => {
    // console.log(refundID);

    this.refundId = refundID;
    // if (assignStatus == 1) this.refundStatus = '1';
    // if (assignStatus == 3) this.refundStatus = '2';
    const dialogRef = this.matDialog.open(ApprovedDetailsComponent, {
      autoFocus: false,
      // maxWidth: 'vw',
      maxHeight: this.refundService.maxHeight,
      // height: '100%',
      width: this.refundService.width,
      data: {
        refundId: this.refundId,
        status: assignStatus,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
      // console.log('The dialog was closed');
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
}
