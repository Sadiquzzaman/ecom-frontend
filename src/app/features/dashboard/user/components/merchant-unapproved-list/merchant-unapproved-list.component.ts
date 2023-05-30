import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { UsersService } from '../../../../../core/services/users.service';
import { ResponseService } from '../../../../../shared/services/response.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-merchant-unapproved-list',
  templateUrl: './merchant-unapproved-list.component.html',
  styleUrls: ['./merchant-unapproved-list.component.scss'],
})
export class MerchantUnapprovedListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'checkbox',
    'firstName',
    'lastName',
    'email',
    'phone',
    'gender',
    // 'action',
  ];
  dataSource: any[] = [];
  pagination = {
    isLoading: true,
    rowsPerPage: 10,
    totalCount: 0,
  };
  isSuperAdmin = false;
  allUser = [];

  merchantIds: string[] = [];
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

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

  first_text = 'Merchant Name';
  firstText: string = '';

  second_text = 'Email';
  secondText: string = '';

  third_text = 'Phone';
  thirdText: string = '';

  fromDate: string = '';
  toDate: string = '';

  multipleRow: boolean = false;
  gap: string = '10px';

  constructor(
    private userService: UsersService,
    private readonly rS: ResponseService,
    private readonly matDialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.showAllUser();
  }

  showAllUser(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort.direction.toUpperCase();
          const approvalLabel = '0';

          return this.userService.adminPagination(
            page,
            limit,
            sort,
            order,
            ['MERCHANT_ROLE'],
            approvalLabel,
            this.firstText,
            this.secondText,
            this.thirdText
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
      .subscribe((data) => (this.dataSource = data));
  }

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
    this.showAllUser();
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
        this.userService.delete(id).subscribe((res) => {
          this.rS.fire(res);
        });
      }
      this.dialogRef = null;
    });
  };

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row) => this.selection.select(row));
  }

  logSelection() {
    this.merchantIds = [];
    this.selection.selected.forEach((data) => {
      this.merchantIds.push(data.merchant.id);
    });
    if (this.merchantIds.length) {
      this.updateStatus();
    } else {
      this.rS.message('Please select which merchants will be approved.', true);
    }
  }

  updateStatus = () => {
    let dto = { ids: this.merchantIds, status: true };
    this.userService.updateApprovalStatus(dto).subscribe((res) => {
      this.selection.clear();
      this.showAllUser();
      this.rS.fire(res);
    });
  };
}
