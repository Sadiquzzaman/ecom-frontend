import { ReturnService } from './../../return.service';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { PaymentMethodEnum } from 'src/app/shared/enum/payment-status.enum';
import { RefundShippingType } from 'src/app/shared/enum/refund-shipping-type.enum';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { ResponseService } from 'src/app/shared/services/response.service';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ApprovalDetailsComponent } from '../approval-details/approval-details.component';

@Component({
  selector: 'app-assigned-return-list',
  templateUrl: './assigned-return-list.component.html',
  styleUrls: ['./assigned-return-list.component.scss'],
})
export class AssignedReturnListComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  dataSource: any[] = [];
  invoiceId: string;
  transporterId: string;
  expectedPickingDate: string;
  paymentMethodEnum = PaymentMethodEnum;
  refundId: string;

  refundShippingType = RefundShippingType;

  response: {
    shopInvoiceId: string;
    deliveryManId: string;
    expectedShipmentDate: string;
  };

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  shippingStatus = 1;
  refundApprovalBoolean = 'true';
  assignStatus = 1;

  gap: string = '5px';
  fromDate: string;
  toDate: string;
  entity = 'customer';
  entityId: string = '';
  secondEntity = '';
  secondEntityId: string = '';
  dropdownName = '';
  dropdownId: string = '';
  secondDropdownName = '';
  secondDropdownId: string = '';
  isAdmin = true;
  multipleRow = false;

  entityFlex = 30;
  secondEntityFlex = 28;
  dropdownFlex = 20;
  secondDropdownFlex = 30;
  from_dateFlex = 25;
  to_dateFlex = 25;

  /******************* table columns ************************/
  displayedColumns: string[] = [
    'sl',

    // 'assignedAt',
    // 'expectedDeliveryDate',
    'shop',
    // 'shippingType',
    // 'totalRefundableAmount',
    // 'transporter',
    // 'deliveryAddress',
    'details',
    // 'picked',
  ];

  constructor(
    private readonly returnService: ReturnService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly token: TokenStorageService,
    private readonly systemService: SystemService,
    private readonly matDialog: MatDialog,
    private readonly rS: ResponseService
  ) {}

  ngOnInit(): void {
    // if (!this.token.isAdmin()) {
    //   this.isAdmin = false;
    // }
    if (this.token.isAdmin()) {
      this.secondEntity = 'delivery man';
      this.displayedColumns.splice(
        2,
        0,
        'shippingType',
        'totalRefundableAmount',
        'customer',
        'transporter'
      );
      this.displayedColumns.splice(1, 0, 'pickUpDate');
    } else if (this.token.isTransporter()) {
      this.isAdmin = false;
      this.multipleRow = false;
      this.from_dateFlex = 20;
      this.to_dateFlex = 20;
      this.displayedColumns.splice(1, 0, 'pickUpDate');
      this.displayedColumns.splice(3, 0, 'shippingType', 'customer');
      this.displayedColumns.push('picked');
    } else if (this.token.isMerchant()) {
      this.displayedColumns.splice(1, 0, 'assignedAt', 'totalRefundableAmount');
      this.displayedColumns.splice(4, 0, 'transporter');
    }
  }

  ngAfterViewInit(): void {
    if (this.token.isMerchant()) {
      this.showAllForMerchant();
    } else {
      this.showAll();
    }
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  showAllForMerchant = () => {
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

          return this.returnService.assignedRefundListforMerchant(
            page,
            limit,
            sort,
            order,
            this.assignStatus
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
      .subscribe((data) => {
        console.log(data);
        this.dataSource = data;
      });
  };

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

          return this.returnService.assignedRefundRequestPagination(
            page,
            limit,
            sort,
            order,
            this.shippingStatus,
            this.refundApprovalBoolean,
            this.assignStatus,
            this.isAdmin,
            this.entityId,
            this.secondEntityId,
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

  // changeStatus1 = (id: string, status: number) => {
  //   const statusDto = { status };
  //   this.transporterRefundService.update(id, statusDto).subscribe((res) => {
  //     this.showAll();
  //   });
  // };

  changeStatus = (id: string, status: number) => {
    const statusDto = { status };
    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Have your picked the items?',
        message: 'This can`t be undone',
      },
    });

    this.dialogRef.afterClosed().subscribe((yes) => {
      if (yes) {
        this.pagination.isLoading = true;
        this.returnService.update(id, statusDto).subscribe((res) => {
          this.rS.fire(res);
          this.showAll();
        });
      }
      this.dialogRef = null;
    });
  };

  submittedSearch = ($event: any) => {
    // console.log($event);
    const { entityId, secondEntity, fromDate, toDate } = $event;
    this.entityId = entityId;
    this.secondEntity = secondEntity;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.showAll();
  };

  goToReturnRequestDetails = (refundID: string) => {
    console.log(refundID);

    this.refundId = refundID;
    const dialogRef = this.matDialog.open(ApprovalDetailsComponent, {
      autoFocus: false,
      maxHeight: '90vh',
      width: '60rem',
      data: {
        refundApprovalId: this.refundId,
      },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(result);
    //   console.log('The dialog was closed');
    // });
  };
}
