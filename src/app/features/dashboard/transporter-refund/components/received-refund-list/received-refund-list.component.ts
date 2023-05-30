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
import { ShippingStatus } from './../../../../../shared/enum/shipping-status.enum';
import { TransporterRefundService } from './../../transporter-refund.service';
@Component({
  selector: 'app-received-refund-list',
  templateUrl: './received-refund-list.component.html',
  styleUrls: ['./received-refund-list.component.scss'],
})
export class ReceivedRefundListComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  displayedColumns: string[] = [
    'sl',
    'receivedAt',
    // 'expectedDeliveryDate',
    // 'shop',
    // 'shippingType',
    // 'invoiceTotal',
    'customer',
    // 'deliveryAddress',
    'details',
    'status',
  ];
  dataSource: any[] = [];
  invoiceId: string;
  transporterId: string;
  expectedPickingDate: string;
  paymentMethodEnum = PaymentMethodEnum;
  isloading = true;
  status = ShippingStatus;
  refundId: string;
  refundStatus: string;

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

  shippingStatus = 5;
  assignStatus = 404;
  refundApprovalBoolean = 'false';

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

  constructor(
    public dialog: MatDialog,
    private readonly router: Router,
    private readonly cdRef: ChangeDetectorRef,
    private readonly token: TokenStorageService,
    private readonly systemService: SystemService,
    private readonly rS: ResponseService,
    private readonly transporterRefundService: TransporterRefundService,
    private readonly refundService: RefundService
  ) {}

  ngOnInit(): void {
    if (!(this.token.isAdmin() || this.token.isTransporter())) {
      this.router.navigate([this.token.DASHBOARD]);
    }
    if (this.token.isAdmin()) {
      this.displayedColumns.splice(3, 0, 'transporter');
      this.displayedColumns.push('action');
      this.dropdownName = 'delivery man';
    } else if (this.token.isTransporter()) {
      this.displayedColumns.splice(1, 0, 'pickedAt');
      this.isAdmin = false;
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
          const sort = this.sort?.active || 'receivedAt';
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

  changeStatus = (id: string, status: number) => {
    const statusDto = { status };
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Have your received the items?',
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
    const { entityId, dropdownId, fromDate, toDate } = $event;
    this.entityId = entityId;
    this.dropdownId = dropdownId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.showAll();
  };

  goToReturnRequestDetails = (refundID: string, assignStatus: number = 1) => {
    // console.log(refundID);
    this.refundId = refundID;
    // if (assignStatus == 1) this.refundStatus = '1';
    // if (assignStatus == 3) this.refundStatus = '2';
    const dialogRef = this.dialog.open(ApprovedDetailsComponent, {
      autoFocus: false,
      maxHeight: this.refundService.maxHeight,
      width: this.refundService.width,
      data: {
        refundId: this.refundId,
        status: assignStatus,
      },
    });
  };
}
