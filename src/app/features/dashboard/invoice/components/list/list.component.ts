import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { InvoiceService } from '../../invoice.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'Sl.no',
    'createdBy',
    'updatedBy',
    'createdAt',
    'updatedAt',
    'status',
    'tran_date',
    'trans_id',
    'val_id',
    'amount',
    'store_amount',
    'card_type',
    'card_no',
    'bank_tarn_id',
    'card_issuer',
    'card_brand',
    'card_issuer_country',
    'card_issuer_country_code',
    'currency_type',
    'currency_amount',
    'verify_sign',
    'verify_key',
    'risk_level',
    'risk_title',
    'value_a',
    'value_b',
    'value_c',
    'value_d',
    'online_payment_activity_log',
  ];
  dataSource: any[];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly invoiceService: InvoiceService) {}
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

          return this.invoiceService.pagination(page, limit, sort, order);
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
        this.dataSource = data;
        console.log(this.dataSource);
      });
  };
}
