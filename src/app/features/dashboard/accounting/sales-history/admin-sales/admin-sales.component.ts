import { Router } from '@angular/router';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { AccountingService } from '../../accounting.service';

@Component({
  selector: 'app-admin-sales',
  templateUrl: './admin-sales.component.html',
  styleUrls: ['./admin-sales.component.scss'],
})
export class AdminSalesComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  displayedColumns: string[] = [
    'updatedAt',
    'createAt',
    'customer',
    'status',
    'invoiceTotal',
    'orderId',
    'InvoiceId',
  ];
  dataSource: any[] = [];

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

  constructor(
    private accountingService: AccountingService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.entityId = '';
    this.fromDate = '';
    this.toDate = '';
  };

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  showAll = () => {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.accountingService.adminInvPagination(
            page,
            limit,
            sort,
            order,
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

  goToOrderDetails = (id: string) => {
    this.router.navigate(['/dashboard/order/details/' + id]);
  };

  goToInvoiceDetails = (id: string) => {
    this.router.navigate(['/dashboard/order/invoice/' + id]);
  };

  submittedSearch = ($event: any) => {
    // console.log($event);
    const { entityId, fromDate, toDate } = $event;
    this.entityId = entityId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.showAll();
  };

  exportFile = (fileExtension: string) => {
    //this.pagination.isLoading = true;
    const page = this.paginator.pageIndex + 1;
    const limit = this.paginator.pageSize;
    const sort = this.sort?.active || 'updatedAt';
    const order = this.sort?.direction.toUpperCase() || 'DESC';

    const fileName: string = 'Admin Sales History';

    this.accountingService.adminSalesFileForAdmin(
      page,
      limit,
      sort,
      order,
      this.entityId,
      this.fromDate,
      this.toDate,
      fileExtension
    );
  };
}
