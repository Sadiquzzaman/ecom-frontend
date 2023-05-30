import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { TokenStorageService } from '../../../../../../app/core/services/token-storage.service';
import { ProductService } from '../../../product/product.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { ResponseService } from '../../../../../shared/services/response.service';
import { ShopService } from '../../shop.service';

@Component({
  selector: 'app-approved-list',
  templateUrl: './approved-list.component.html',
  styleUrls: ['./approved-list.component.scss'],
})
export class ApprovedListComponent implements AfterViewInit, AfterViewChecked {
  displayedColumns: string[] = [
    'checkbox',
    'shopProfileImage',
    'shopCoverImage',
    'name',
    'type',
    // 'domain',
    // 'url',
    'location',
    'action',
  ];

  dataSource: any[] = [];
  shopIds: string[] = [];

  selection = new SelectionModel<any>(true, []);

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  coverImageType = ImageType.SHOP_COVER;
  profileImageType = ImageType.SHOP_PROFILE_SMALL;

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
    private readonly router: Router,
    private readonly shopService: ShopService
  ) {
    if (this.token.isAdmin()) {
      // this.router.navigate(['/dashboard/shop/approved-list']);
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
          const is_approved = 1;

          return this.shopService.approvalPagination(
            page,
            limit,
            sort,
            order,
            is_approved
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

  shopView = (id: string) => {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/shop/${id}`])
    );
    window.open(url, '_blank');
  };

  // UnApprove = (id: string = '') => {
  //   if (id) {
  //     this.shopIds.push(id);
  //   } else {
  //     for (const row of this.dataSource) {
  //       this.shopIds.push(row.id);
  //     }
  //   }

  //   let dto = { ids: this.shopIds, status: false };

  //   this.shopService.updateStatusToTrue(dto).subscribe((res) => {});
  //   this.showAll();
  // };

  edit = (id: string) => {
    this.router.navigateByUrl('/dashboard/shop/edit/' + id);
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
        this.shopService.remove(id).subscribe((res) => {
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
    this.shopIds = [];
    this.selection.selected.forEach((data) => {
      this.shopIds.push(data.id);
    });
    if (this.shopIds.length) {
      this.updateStatus();
    } else {
      this.rS.message(
        'Please select which merchants will be unapproved.',
        true
      );
    }
  }

  updateStatus = () => {
    let dto = { ids: this.shopIds, status: false };
    this.shopService.updateApprovalStatus(dto).subscribe((res) => {
      this.selection.clear();
      this.showAll();
      this.rS.fire(res);
    });
  };
}
