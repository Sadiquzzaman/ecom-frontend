import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ApprovalDetailsComponent } from './../approval-details/approval-details.component';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { TransporterAssignComponent } from 'src/app/shared/components/features/dashboard/transporter-assign/transporter-assign.component';
import { ResponseService } from 'src/app/shared/services/response.service';
import { ReturnService } from '../../return.service';

@Component({
  selector: 'app-unassigned-return-list',
  templateUrl: './unassigned-return-list.component.html',
  styleUrls: ['./unassigned-return-list.component.scss'],
})
export class UnassignedReturnListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'sl.no',
    'createAt',
    'totalRefundableAmount',
    'isApproved',
    'customer',
    'shop',
    'details',
    'action',
  ];
  dataSource: any[] = [];
  refundApprovalId: string;
  refundRequestId: string;
  isAdmin = true;

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  constructor(
    private readonly returnService: ReturnService,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
    private readonly rS: ResponseService,
    private readonly token: TokenStorageService
  ) {
    if (this.token.isAdmin()) {
      this.isAdmin = true;
    } else if (this.token.isMerchant()) {
      this.isAdmin = false;
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
        switchMap(() => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';
          const assignStatus = 0;

          return this.returnService.approvedRefundListPaginationForAdmin(
            page,
            limit,
            sort,
            order,
            this.isAdmin,
            assignStatus
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

  openDialog(refundID: string, refundApprovalId: string): void {
    console.log(refundID);
    console.log(refundApprovalId);
    this.refundRequestId = refundID;
    this.refundApprovalId = refundApprovalId;
    const dialogRef = this.matDialog.open(TransporterAssignComponent, {
      width: '25rem',
      data: {
        refundRequestId: this.refundRequestId,
        refundApprovalId: this.refundApprovalId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.returnService
        .assignTransporterForCustomerPickUp(result)
        .subscribe((res) => {
          this.showAll();
        });
      console.log(result);
      console.log('The dialog was closed');
    });
  }

  goToReturnRequestDetails = (refundID: string) => {
    console.log(refundID);
    this.refundApprovalId = refundID;
    const dialogRef = this.matDialog.open(ApprovalDetailsComponent, {
      autoFocus: false,
      maxHeight: '90vh',
      width: '60rem',
      data: {
        refundApprovalId: this.refundApprovalId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      console.log('The dialog was closed');
    });
  };
}
