import { PaymentMethodEnum } from './../../../../../shared/enum/payment-status.enum';
import { SystemService } from 'src/app/shared/services/system.service';
import { ShippingDetailsService } from './../../shipping-details.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { TransporterDialogComponent } from '../transporter-dialog/transporter-dialog.component';
import { ShippingStatus } from '../../../../../shared/enum/shipping-status.enum';
@Component({
  selector: 'app-assigned-order-list',
  templateUrl: './assigned-order-list.component.html',
  styleUrls: ['./assigned-order-list.component.scss'],
})
export class AssignedOrderListComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  displayedColumns: string[] = [
    'updatedAt',
    'createAt',
    'expectedShipmentDate',
    'invoiceTotal',
    'transporter',
    'shop',
    // 'status',
    'deliveryStatus',
    'InvoiceId',
  ];
  dataSource: any[] = [];
  invoiceId: string;
  transporterId: string;
  expectedPickingDate: string;
  shippingStatus = ShippingStatus;
  paymentMethodEnum = PaymentMethodEnum;

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

  gap: string = '10px';
  fromDate: string;
  toDate: string;
  entity = 'shop';
  entityId: string = '';
  secondEntity = '';
  secondEntityId: string = '';
  dropdownName = 'Shipping Status';
  dropdownId: string = '';
  secondDropdownName = '';
  secondDropdownId: string = '';
  isAdmin = true;
  multipleRow = true;
  assignStatus = '1';

  entityFlex = 30;
  secondEntityFlex = 30;
  dropdownFlex = 20;
  secondDropdownFlex = 30;
  from_dateFlex = 25;
  to_dateFlex = 25;

  /******************* image ************************/

  constructor(
    private shippingDetailsService: ShippingDetailsService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly router: Router,
    private readonly token: TokenStorageService,
    private readonly systemService: SystemService,
    public dialog: MatDialog
  ) {
    if (this.token.isMerchant()) {
      // this.displayedColumns.splice(3, 0, 'expectedShipmentDate');
    } else if (this.token.isAdmin()) {
      this.displayedColumns.splice(4, 0, 'paymentMethod');
      this.displayedColumns.splice(7, 0, 'deliveryAddress');
      // this.displayedColumns.splice(9, 0, 'orderId');
    }
  }

  ngOnInit(): void {
    this.initForm();
    if (!this.token.isAdmin()) {
      this.isAdmin = false;
      this.multipleRow = false;
      this.from_dateFlex = 20;
      this.to_dateFlex = 20;
    } else {
      this.secondEntity = 'customer';
      this.secondDropdownName = 'Delivery Man';
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

          return this.shippingDetailsService.shopInvoicePagination(
            page,
            limit,
            sort,
            order,
            this.assignStatus,
            this.dropdownId,
            this.entityId,
            this.secondEntityId,
            this.secondDropdownId,
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
      .subscribe((data) => {
        console.log(data);
        this.dataSource = data;
      });
  };

  submittedSearch = ($event: any) => {
    // console.log($event);
    const {
      entityId,
      secondEntityId,
      dropdownId,
      secondDropdownId,
      fromDate,
      toDate,
    } = $event;
    this.entityId = entityId;
    this.secondEntityId = secondEntityId;
    this.dropdownId = dropdownId;
    this.secondDropdownId = secondDropdownId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.showAll();
  };

  openDialog(invoice: string): void {
    this.invoiceId = invoice;
    const dialogRef = this.dialog.open(TransporterDialogComponent, {
      width: '25rem',
      data: {
        invoiceId: this.invoiceId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      result.expectedShipmentDate = this.systemService.convertDateToString(
        result.expectedShipmentDate
      );
      console.log(result);
      this.shippingDetailsService
        .assignTransporter(result)
        .subscribe((res) => {});
      console.log('The dialog was closed');
    });
  }
}
