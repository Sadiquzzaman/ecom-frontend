import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import { ChangeTicketStatusDto } from './../../../../../shared/dto/core/change-ticket-status.dto';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TicketStatus } from '../../../../../shared/enum/ticket-status.enum';
import { CouponService } from '../../coupon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit, AfterViewChecked, OnInit {
  displayedColumns: string[] = [
    'seriall no.',
    'startDate',
    'endDate',
    'description',
    'quantity',
    'couponCode',
  ];

  dataSource: any[] = [];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  entity: string = '';
  entityId: string = '';

  secondEntity: string = '';
  secondEntityId: string = '';

  thirdEntity: string = '';
  thirdEntityId: string = '';

  dropdownName = '';
  dropdownId: string = '';

  secondDropdownName = '';
  secondDropdownId: string = '';

  first_text = 'coupon code';
  firstText: string = '';

  second_text = '';
  secondText: string = '';

  third_text = '';
  thirdText: string = '';

  fromDate: string = '';
  toDate: string = '';

  multipleRow: boolean = false;
  gap: string = '10px';

  constructor(
    private readonly couponService: CouponService,
    private readonly cdRef: ChangeDetectorRef,
    public readonly token: TokenStorageService
  ) {}

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngOnInit(): void {}

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue;
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

          return this.couponService.pagination(
            page,
            limit,
            sort,
            order,
            this.firstText,
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
      thirdEntityId,
      fromDate,
      toDate,
      firstText,
      secondText,
      thirdText,
      dropdownId,
      secondDropdownId,
    } = $event;
    this.entityId = entityId;
    this.secondEntityId = secondEntityId;
    this.thirdEntityId = thirdEntityId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.firstText = firstText;
    this.secondText = secondText;
    this.thirdText = thirdText;
    this.dropdownId = dropdownId;
    this.secondDropdownId = secondDropdownId;
    this.showAll();
  };
}
