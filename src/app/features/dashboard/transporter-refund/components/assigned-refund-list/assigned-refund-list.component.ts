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
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ApprovedDetailsComponent } from 'src/app/shared/components/features/dashboard/approved-details/approved-details.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { RefundShippingType } from 'src/app/shared/enum/refund-shipping-type.enum';
import { ResponseService } from 'src/app/shared/services/response.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { RefundService } from '../../../refund/refund.service';
import { PaymentMethodEnum } from './../../../../../shared/enum/payment-status.enum';
import { TransporterRefundService } from './../../transporter-refund.service';
@Component({
  selector: 'app-assigned-refund-list',
  templateUrl: './assigned-refund-list.component.html',
  styleUrls: ['./assigned-refund-list.component.scss'],
})
export class AssignedRefundListComponent
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
  refundApprovalBoolean = 'false';
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
    'pickUpDate',
    // 'assignedAt',
    // 'expectedDeliveryDate',
    // 'shop',
    // 'shippingType',
    // 'totalRefundableAmount',
    // 'transporter',
    'customer',
    // 'deliveryAddress',
    'details',
    // 'picked',
  ];

  constructor(
    private readonly transporterRefundService: TransporterRefundService,
    private readonly refundService: RefundService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly token: TokenStorageService,
    private readonly systemService: SystemService,
    private readonly matDialog: MatDialog,
    private readonly rS: ResponseService
  ) {}

  ngOnInit(): void {
    if (!(this.token.isAdmin() || this.token.isTransporter())) {
      this.router.navigate([this.token.DASHBOARD]);
    }

    // if (!this.token.isAdmin()) {
    //   this.isAdmin = false;
    // }
    if (this.token.isAdmin()) {
      this.dropdownName = 'delivery man';
      this.displayedColumns.splice(
        3,
        0,
        'totalRefundableAmount',
        'transporter'
      );
    } else if (this.token.isTransporter()) {
      this.isAdmin = false;
      this.multipleRow = false;
      this.from_dateFlex = 20;
      this.to_dateFlex = 20;
      this.displayedColumns.push('picked');
    }
  }

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
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

          return this.transporterRefundService.assignedRefundRequestPagination(
            page,
            limit,
            sort,
            order,
            this.shippingStatus,
            this.refundApprovalBoolean,
            this.assignStatus,
            this.isAdmin,
            this.entityId,
            this.dropdownId,
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
        this.transporterRefundService.update(id, statusDto).subscribe((res) => {
          this.rS.fire(res);
          this.showAll();
        });
      }
      this.dialogRef = null;
    });
  };

  submittedSearch = ($event: any) => {
    // console.log($event);
    const { entityId, dropdownId, fromDate, toDate } = $event;
    this.entityId = entityId;
    this.dropdownId = dropdownId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.showAll();
  };

  goToReturnRequestDetails = (refundID: string, assignStatus: number = 1) => {
    console.log(refundID);

    this.refundId = refundID;
    const dialogRef = this.matDialog.open(ApprovedDetailsComponent, {
      autoFocus: false,
      maxHeight: this.refundService.maxHeight,
      width: this.refundService.width,
      data: {
        refundId: this.refundId,
        status: assignStatus,
      },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(result);
    //   console.log('The dialog was closed');
    // });
  };
}
