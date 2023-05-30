import { ApprovalDetailsComponent } from './../approval-details/approval-details.component';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { PaymentMethodEnum } from 'src/app/shared/enum/payment-status.enum';
import { RefundShippingType } from 'src/app/shared/enum/refund-shipping-type.enum';
import { ShippingStatus } from 'src/app/shared/enum/shipping-status.enum';
import { ResponseService } from 'src/app/shared/services/response.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { ReturnService } from '../../return.service';

@Component({
  selector: 'app-delivered-return-list',
  templateUrl: './delivered-return-list.component.html',
  styleUrls: ['./delivered-return-list.component.scss'],
})
export class DeliveredReturnListComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  displayedColumns: string[] = [
    'sl',
    'receivedAt',
    // 'expectedDeliveryDate',
    'shippingType',
    'shop',
    // 'invoiceTotal',
    'customer',
    // 'deliveryAddress',
    'details',
    // 'status',
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

  shippingStatus = 3;
  assignStatus = 1;
  refundApprovalBoolean = 'true';

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
    private readonly returnService: ReturnService
  ) {}

  ngOnInit(): void {
    if (this.token.isAdmin()) {
      this.displayedColumns.splice(3, 0, 'transporter');
      // this.displayedColumns.push('action');
      this.dropdownName = 'delivery man';
    } else if (this.token.isTransporter()) {
      this.displayedColumns.splice(1, 0, 'pickedAt');
      this.isAdmin = false;
    } else {
      this.router.navigate(['/dashboard']);
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
        this.returnService.update(id, statusDto).subscribe((res) => {
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

  goToReturnRequestDetails = (refundID: string) => {
    // console.log(refundID);
    this.refundId = refundID;
    const dialogRef = this.dialog.open(ApprovalDetailsComponent, {
      autoFocus: false,
      maxHeight: '90vh',
      width: '60rem',
      data: {
        refundApprovalId: this.refundId,
      },
    });
  };
}
