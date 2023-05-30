import { ReturnService } from './../../return.service';
import { ApprovalDetailsComponent } from './../approval-details/approval-details.component';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PaymentMethodEnum } from 'src/app/shared/enum/payment-status.enum';
import { ShippingStatus } from 'src/app/shared/enum/shipping-status.enum';
import { RefundShippingType } from 'src/app/shared/enum/refund-shipping-type.enum';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { ResponseService } from 'src/app/shared/services/response.service';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-picked-return-list',
  templateUrl: './picked-return-list.component.html',
  styleUrls: ['./picked-return-list.component.scss'],
})
export class PickedReturnListComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  // displayedColumns: string[] = [
  //   'updatedAt',
  //   'pickedAt',
  //   // 'expectedDeliveryDate',
  //   // 'shop',
  //   'shippingType',
  //   // 'invoiceTotal',
  //   'customer',
  //   'deliveryAddress',
  //   'details',
  //   // 'picked',
  // ];
  dataSource: any[] = [];
  invoiceId: string;
  transporterId: string;
  expectedPickingDate: string;
  paymentMethodEnum = PaymentMethodEnum;
  status = ShippingStatus;
  refundId: string;
  isLoading = true;

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

  shippingStatus = 2;
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

  /******************* table columns ************************/
  displayedColumns: string[] = [
    'sl',
    'pickedAt',
    // 'assignedAt',
    // 'expectedDeliveryDate',
    'shippingType',
    'shop',
    // 'totalRefundableAmount',
    // 'transporter',
    'customer',
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
    if (this.token.isAdmin()) {
      this.secondEntity = 'delivery man';
      this.displayedColumns.splice(
        3,
        0,
        'totalRefundableAmount',
        'transporter'
      );
    } else if (this.token.isTransporter()) {
      this.displayedColumns.push('received');
      this.isAdmin = false;
      // this.multipleRow = false;
      this.from_dateFlex = 20;
      this.to_dateFlex = 20;
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
          const sort = this.sort?.active || 'pickedAt';
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

  changeStatus = (id: string, status: number) => {
    const statusDto = { status };
    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Have you picked the items?',
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
    const { entityId, secondEntity, fromDate, toDate } = $event;
    this.entityId = entityId;
    this.secondEntity = secondEntity;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.showAll();
  };

  goToReturnRequestDetails = (refundID: string, assignStatus: number = 1) => {
    // console.log(refundID);
    this.refundId = refundID;
    const dialogRef = this.matDialog.open(ApprovalDetailsComponent, {
      autoFocus: false,
      maxHeight: '90vh',
      width: '60rem',
      data: {
        refundApprovalId: this.refundId,
      },
    });
  };
}
