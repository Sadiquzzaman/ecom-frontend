import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ResponseService } from '../../../../../shared/services/response.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../../shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { ProductService } from '../../product.service';
import { TokenStorageService } from '../../../../../../app/core/services/token-storage.service';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Bool } from 'src/app/shared/enum/bool.enum';

@Component({
  selector: 'app-approved-list',
  templateUrl: './approved-list.component.html',
  styleUrls: ['./approved-list.component.scss'],
})
export class ApprovedListComponent implements AfterViewInit, AfterViewChecked {
  displayedColumns: string[] = [
    'checkbox',
    'image',
    'name',
    'price',
    'isRefundable',
    'action',
  ];

  dataSource: any[] = [];
  productIds: string[] = [];

  bool = Bool;

  selection = new SelectionModel<any>(true, []);

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  /******************* image ************************/
  imageType = ImageType.PRODUCT_SMALL;

  constructor(
    private productService: ProductService,
    private readonly rS: ResponseService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly matDialog: MatDialog,
    private readonly token: TokenStorageService,
    private readonly router: Router
  ) {
    if (this.token.isAdmin()) {
      // this.router.navigate(['/dashboard/product/approved-list']);
    } else {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
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
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';
          const approvalLabel = 1;

          return this.productService.approvalPagination(
            page,
            limit,
            sort,
            order,
            approvalLabel
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
  };

  productView = (id: string) => {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/product/profile/${id}`])
    );
    window.open(url, '_blank');
  };

  edit = (id: string) => {
    this.router.navigateByUrl('/dashboard/product/edit/' + id);
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
        this.productService.remove(id).subscribe((res) => {
          this.rS.fire(res);
          this.showAll();
        });
      }
      this.dialogRef = null;
    });
  };

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row) => this.selection.select(row));
  }

  logSelection() {
    this.productIds = [];
    this.selection.selected.forEach((data) => {
      this.productIds.push(data.id);
    });
    if (this.productIds.length) {
      this.updateStatus();
    } else {
      this.rS.message('Please select which products will be approved.', true);
    }
  }

  updateStatus = () => {
    let dto = { ids: this.productIds, status: false };
    this.productService.updateApprovalStatus(dto).subscribe((res) => {
      this.selection.clear();
      this.showAll();
      this.rS.fire(res);
    });
  };
}
