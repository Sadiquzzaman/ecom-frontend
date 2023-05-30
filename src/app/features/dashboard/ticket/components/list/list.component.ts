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
import { TicketService } from '../../ticket.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { ResponseService } from 'src/app/shared/services/response.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit, AfterViewChecked, OnInit {
  displayedColumns: string[] = [
    'seriall no.',
    'createAt',
    'ticketDepartment',
    'subject',
    // 'id',
    'status',
    'issueDetails',
  ];

  TicketStatus = TicketStatus;
  dataSource: any[] = [];
  ticktsDetails: any;
  status = false;

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

  dropdownName = 'Department';
  dropdownId: string = '';

  secondDropdownName = 'ticket status';
  secondDropdownId: string = '';

  first_text = '';
  firstText: string = '';

  second_text = '';
  secondText: string = '';

  third_text = '';
  thirdText: string = '';

  fromDate: string = '';
  toDate: string = '';

  multipleRow: boolean = false;
  gap: string = '10px';
  ticketStatusArray: any[] = [];

  constructor(
    private readonly ticketService: TicketService,
    private readonly cdRef: ChangeDetectorRef,
    public readonly token: TokenStorageService,
    public readonly systemService: SystemService,
    public readonly rS: ResponseService
  ) {
    if (this.token.isAdmin()) {
      this.ticketStatusArray = this.systemService.enumToArray(
        this.TicketStatus,
        0
      );
      this.multipleRow = true;
      this.first_text = 'phone';
      this.displayedColumns.splice(4, 0, 'mobile');
      this.displayedColumns.push('actions');
      // this.displayedColumns.push('name', 'mail', 'mobile', 'date', 'actions');
    } else {
      // this.displayedColumns.push('status');
    }
  }

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngOnInit(): void {}

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue;
    console.log(filterValue);
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  changeStatus = (id: string, status: TicketStatus) => {
    const changeTicketStatusDto = new ChangeTicketStatusDto();
    changeTicketStatusDto.ticketId = id;
    changeTicketStatusDto.status = status;
    this.ticketService
      .changeTicketStatus(changeTicketStatusDto)
      .subscribe((res) => {
        this.rS.fire(res);
        this.showAll();
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

          return this.ticketService.pagination(
            page,
            limit,
            sort,
            order,
            this.firstText,
            this.secondText,
            this.dropdownId,
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

  trimString(text: any, length: number) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  changeSeeMoreStatus() {
    if (this.status) {
      this.status = false;
    } else {
      this.status = true;
    }
  }
}
