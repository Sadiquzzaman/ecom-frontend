import { PaymentMethodEnum } from './../../../../../shared/enum/payment-status.enum';
import { SystemService } from 'src/app/shared/services/system.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  // Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  // MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { TransporterDetailsService } from '../../transporter-details.service';
import { ResponseService } from 'src/app/shared/services/response.service';
@Component({
  selector: 'app-assigned-list',
  templateUrl: './assigned-list.component.html',
  styleUrls: ['./assigned-list.component.scss'],
})
export class AssignedListComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  displayedColumns: string[] = [
    'updatedAt',
    'expectedShipmentDate',
    // 'expectedDeliveryDate',
    'payment',
    // 'invoiceTotal',
    // 'customer',
    'shop',
    'deliveryAddress',
    'invoice',
    // 'picked',
  ];
  dataSource: any[] = [];
  invoiceId: string;
  transporterId: string;
  expectedPickingDate: string;
  paymentMethodEnum = PaymentMethodEnum;
  shippingStatus = 1;

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

  entityId: string = '';
  fromDate: string = '';
  toDate: string = '';
  entity = 'shop';
  // entity = '';
  isAdmin = true;

  /******************* image ************************/

  constructor(
    private readonly transporterDetailsService: TransporterDetailsService,
    private readonly cdRef: ChangeDetectorRef,
    // private readonly router: Router,
    private readonly token: TokenStorageService,
    // private readonly systemService: SystemService,
    private readonly rS: ResponseService,
    public dialog: MatDialog
  ) {
    if (this.token.isAdmin()) {
      this.displayedColumns.splice(3, 0, 'transporter');
    } else if (this.token.isTransporter()) {
      this.displayedColumns.push('action');
    }
  }

  ngOnInit(): void {
    if (!this.token.isAdmin()) {
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
          const sort = this.sort?.active || 'createAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.transporterDetailsService.transporterTaskList(
            page,
            limit,
            sort,
            order,
            this.shippingStatus,
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
      .subscribe((data) => {
        console.log(data);
        this.dataSource = data;
      });
  };

  changeStatus = (id: string, status: number) => {
    const statusDto = { status };
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Have your picked the items?',
        message: 'This can`t be undone',
      },
    });

    this.dialogRef.afterClosed().subscribe((yes) => {
      if (yes) {
        this.pagination.isLoading = true;
        this.transporterDetailsService
          .update(id, statusDto)
          .subscribe((res) => {
            this.rS.fire(res);
            this.showAll();
          });
      }
      this.dialogRef = null;
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
