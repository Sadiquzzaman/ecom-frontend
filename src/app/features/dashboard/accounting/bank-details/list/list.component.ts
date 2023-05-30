import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { AccountingService } from './../../accounting.service';
import { ResponseService } from './../../../../../shared/services/response.service';
import { ConfirmDialogComponent } from './../../../../../shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'updatedAt',
    // 'createdAt',
    'bankname',
    'accountNumber',
    'accountHolderName',
    'remarks',
  ];
  dataSource!: any[];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  gap: string = '5px';

  dropdownName = 'Bank Name';
  dropdownId: string = '';

  secondDropdownName = '';
  secondDropdownId: string = '';

  textBoxName = 'Account Number';
  firstText: string = '';

  secondTextBoxName = 'Account Holder Name';
  secondText: string = '';

  entity = '';
  entityId: string = '';

  secondEntity = '';
  secondEntityId: string = '';

  fromDate: string;
  toDate: string;

  isAdmin = true;
  multipleRow = false;

  entityFlex = 30;
  secondEntityFlex = 30;
  dropdownFlex = 25;
  secondDropdownFlex = 25;
  from_dateFlex = 25;
  to_dateFlex = 25;
  first_textFlex = 20;
  second_textFlex = 20;

  constructor(
    private readonly accountingService: AccountingService,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
    private readonly rS: ResponseService,
    private readonly token: TokenStorageService
  ) {
    if (this.token.isAdmin()) {
      this.displayedColumns.splice(1, 0, 'merchant');
      this.entity = 'merchant';
    } else if (this.token.isMerchant()) {
      this.isAdmin = false;
      this.displayedColumns.push('action');
    }
  }

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

          return this.accountingService.bankDetailsPagination(
            page,
            limit,
            sort,
            order,
            this.isAdmin,
            this.dropdownId,
            this.firstText,
            this.secondText,
            this.entityId
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

  edit = (id: string) => {
    this.router.navigateByUrl('/dashboard/accounting/bank-details/edit/' + id);
  };

  delete = (id: string) => {
    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure to delete?',
        message: 'This can`t be undone',
      },
    });

    this.dialogRef.afterClosed().subscribe((yes) => {
      if (yes) {
        this.accountingService.removeBankDetail(id).subscribe((res) => {
          this.rS.fire(res);
          this.showAll();
        });
      }
      this.dialogRef = null;
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
      firstText,
      secondText,
    } = $event;
    this.entityId = entityId;
    this.secondEntityId = secondEntityId;
    this.dropdownId = dropdownId;
    this.secondDropdownId = secondDropdownId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.firstText = firstText;
    this.secondText = secondText;
    this.showAll();
  };
}
