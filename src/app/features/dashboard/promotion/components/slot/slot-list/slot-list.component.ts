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
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { ResponseService } from 'src/app/shared/services/response.service';
import { PromotionType } from 'src/app/shared/enum/promotion-type.enum';
import { PromotionService } from '../../../promotion.service';
import { SlotAddComponent } from '../slot-add/slot-add.component';
import { SlotEditComponent } from '../slot-edit/slot-edit.component';

@Component({
  selector: 'app-slot-list',
  templateUrl: './slot-list.component.html',
  styleUrls: ['./slot-list.component.scss'],
})
export class SlotListComponent implements AfterViewInit, AfterViewChecked {
  displayedColumns: string[] = [
    'updatedAt',
    // 'title',
    'dailyCharge',
    'promotionType',
    'limit',
    'actions',
  ];

  dataSource: any[] = [];
  PromotionType = PromotionType;

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
    private readonly matDialog: MatDialog
  ) {
    console.log(this.PromotionType);

    // var keys = Object.keys(this.PromotionType);
    // console.log(keys);

    // var keyArray = keys.slice(keys.length / 2);
    // console.log(keyArray);

    // let newArray = keyArray.map((element: any, index) => {
    //   let ele: any = {};
    //   ele['id'] = index + 1;
    //   ele['name'] = element;
    //   return ele;
    // });

    // console.log(keyArray);
    // console.log(newArray);
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

          return this.promotionService.slotPagination(page, limit, sort, order);
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

  getPromotionType(promotion: any) {
    switch (promotion.type) {
      case 1: {
        return 'BANNER';
        break;
      }
      case 2: {
        return 'PRODUCT SLIDE';
        break;
      }
      case 3: {
        return 'SHOP SLIDE';
        break;
      }
      default:
        return 'BANNER';
        break;
    }
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

  edit = (request: any) => {
    const dialogRef = this.matDialog.open(SlotEditComponent, {
      width: '30rem',
      maxHeight: '90vh',
      data: {
        request: request,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (!result) {
        return;
      }

      let formData: any = result;
      formData.dailyCharge = parseInt(formData.dailyCharge);
      formData.limit = parseInt(formData.limit);

      this.promotionService
        .updatePromotionSlot(request.id, formData)
        .subscribe((res) => {
          this.rS.fire(res);
          this.showAll();
        });
    });
  };
}
