import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ImageType } from 'src/app/core/enum/image-type.enum';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { ResponseService } from 'src/app/shared/services/response.service';
import { PromotionService } from '../../promotion.service';

@Component({
  selector: 'app-unapproved-promotion-list',
  templateUrl: './unapproved-promotion-list.component.html',
  styleUrls: ['./unapproved-promotion-list.component.scss'],
})
export class UnapprovedPromotionListComponent
  implements AfterViewInit, AfterViewChecked
{
  displayedColumns: string[] = [
    'checkbox',
    'promotionCoverImage',
    'shopName',
    'productName',
    'promotionType',
    'startDate',
    'endDate',
    'title',
    'actions',
  ];

  dataSource: any[] = [];
  promotionIds: string[] = [];

  selection = new SelectionModel<any>(true, []);

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  constructor(
    private promotionService: PromotionService,
    private readonly rS: ResponseService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly matDialog: MatDialog,
    private readonly token: TokenStorageService,
    private readonly router: Router
  ) {
    if (this.token.isAdmin()) {
      // this.router.navigate(['/dashboard/promotion/list']);
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
          const isApproved: string = '0';

          return this.promotionService.paginationByApprovalStatus(
            page,
            limit,
            sort,
            order,
            isApproved
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

  getImageType(promotion: any) {
    switch (promotion.type) {
      case 1: {
        return ImageType.BANNER;
        break;
      }
      case 2: {
        return ImageType.PRODUCT_SLIDE;
        break;
      }
      case 3: {
        return ImageType.SHOP_SLIDE;
        break;
      }
    }
    return ImageType.BANNER;
  }

  getPromotionType(promotion: any) {
    switch (promotion.type) {
      case 1: {
        return 'BANNER';
        break;
      }
      case 2: {
        return 'PRODUCT_SLIDE';
        break;
      }
      case 3: {
        return 'SHOP_SLIDE';
        break;
      }
    }
    return ImageType.BANNER;
  }

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
        this.promotionService.remove(id).subscribe((res) => {
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

  // logSelection() {
  //   this.selection.selected.forEach((data) => {
  //     this.UnApprove(data.id);
  //   });
  //   this.selection.clear();
  // }

  logSelection() {
    this.promotionIds = [];
    this.selection.selected.forEach((data) => {
      this.promotionIds.push(data.id);
    });
    console.log(this.promotionIds);

    if (this.promotionIds.length) {
      this.updateStatus();
    } else {
      this.rS.message(
        'Please select which promotions will be unapproved.',
        true
      );
    }
  }

  updateStatus = () => {
    let dto = { ids: this.promotionIds, status: true };
    this.promotionService.updateApprovalStatus(dto).subscribe((res) => {
      this.selection.clear();
      this.showAll();
      this.rS.fire(res);
    });
  };
}
