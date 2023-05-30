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
import { PromotionType } from 'src/app/shared/enum/promotion-type.enum';
import { PromotionStatus } from 'src/app/shared/enum/promotion-status.enum';
import { SystemService } from 'src/app/shared/services/system.service';

@Component({
  selector: 'app-promotion-lists',
  templateUrl: './promotion-lists.component.html',
  styleUrls: ['./promotion-lists.component.scss'],
})
export class PromotionListsComponent
  implements AfterViewInit, AfterViewChecked
{
  displayedColumns: string[] = [
    // 'promotionCoverImage',
    // 'title',
    'promotionType',
    'startDate',
    'endDate',
    'shopName',
    'productName',
    'promotionStatus',
    'actions',
  ];

  dataSource: any[] = [];
  PromotionType = PromotionType;
  PromotionStatus = PromotionStatus;

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  gap: string = '10px';
  fromDate: string;
  toDate: string;
  entity = '';
  entityId: string = '';
  secondEntity = 'shop';
  secondEntityId: string = '';
  thirdEntity = 'product';
  thirdEntityId: string = '';

  dropdownName = 'Promotion Type';
  dropdownId: string = '';
  secondDropdownName = 'Promotion Status';
  secondDropdownId: string = '';

  isAdmin = false;
  multipleRow = true;
  assignStatus = '1';

  entityFlex = 30;
  secondEntityFlex = 33;
  thirdEntityFlex = 33;
  dropdownFlex = 23;
  secondDropdownFlex = 23;
  from_dateFlex = 25;
  to_dateFlex = 25;

  constructor(
    private readonly promotionService: PromotionService,
    private readonly rS: ResponseService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly matDialog: MatDialog,
    private readonly token: TokenStorageService,
    private readonly router: Router,
    private readonly systemService: SystemService
  ) {
    if (this.token.isAdmin()) {
      this.isAdmin = true;
      this.multipleRow = true;
      this.entity = 'merchant';
    } else {
      if (!this.token.hasLicenseAndNID()) {
        this.router.navigate(['/dashboard/user/edit/profile']);
      }
      this.secondEntityFlex = 35;
      this.thirdEntityFlex = 35;
      this.dropdownFlex = 25;
      this.secondDropdownFlex = 35;
      this.from_dateFlex = 30;
      this.to_dateFlex = 30;
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

          return this.promotionService.pagination(
            page,
            limit,
            sort,
            order,
            this.isAdmin,
            this.entityId,
            this.secondEntityId,
            this.thirdEntityId,
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
      .subscribe((data) => (this.dataSource = data));
  };

  submittedSearch = ($event: any) => {
    // console.log($event);
    const {
      entityId,
      secondEntityId,
      thirdEntityId,
      dropdownId,
      secondDropdownId,
      fromDate,
      toDate,
    } = $event;
    this.entityId = entityId;
    this.secondEntityId = secondEntityId;
    this.thirdEntityId = thirdEntityId;
    this.dropdownId = dropdownId;
    this.secondDropdownId = secondDropdownId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.showAll();
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
}
