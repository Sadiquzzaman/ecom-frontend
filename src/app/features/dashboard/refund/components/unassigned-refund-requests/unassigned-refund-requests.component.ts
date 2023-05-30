import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ApprovedDetailsComponent } from 'src/app/shared/components/features/dashboard/approved-details/approved-details.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { TransporterAssignComponent } from 'src/app/shared/components/features/dashboard/transporter-assign/transporter-assign.component';
import { ResponseService } from 'src/app/shared/services/response.service';
import { RefundService } from '../../refund.service';

@Component({
  selector: 'app-unassigned-refund-requests',
  templateUrl: './unassigned-refund-requests.component.html',
  styleUrls: ['./unassigned-refund-requests.component.scss'],
})
export class UnassignedRefundRequestsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'sl',
    'createAt',
    // 'refundRequestQuantity',
    // 'product',
    'totalRefundableAmount',
    'description',
    'customer',
    'details',
    'action',
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
    private readonly token: TokenStorageService
  ) {}

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
          const refundStatus = '1';
          const assignStatus = 2;

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

  openDialog(refundID: string): void {
    console.log(refundID);

    this.refundId = refundID;
    const dialogRef = this.matDialog.open(TransporterAssignComponent, {
      width: '25rem',
      data: {
        refundRequestId: this.refundId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.refundService.assignTransporterForCustomerPickUp(result).subscribe(
        (res) => {
          this.rS.fire(res);
          this.showAll();
        }
        // (err) => {
        //   this.rS.fire(err);
        // }
      );
      // console.log(result);
      // console.log('The dialog was closed');
    });
  }

  goToReturnRequestDetails = (refundID: string, assignStatus: number = 1) => {
    // console.log(refundID);

    this.refundId = refundID;
    // if (assignStatus == 1) this.refundStatus = '1';
    // if (assignStatus == 3) this.refundStatus = '2';
    const dialogRef = this.matDialog.open(ApprovedDetailsComponent, {
      autoFocus: false,
      maxHeight: this.refundService.maxHeight,
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
