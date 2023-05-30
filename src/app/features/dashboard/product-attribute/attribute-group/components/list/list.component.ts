import { ResponseService } from 'src/app/shared/services/response.service';
import { ConfirmDialogComponent } from './../../../../../../shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AttributeGroupService } from '../../attribute-group.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'sl.no',
    'name',
    'description',
    'position',
    'createdAt',
    'updatedAt',
    'action',
  ];
  dataSource: any[];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  constructor(
    private readonly attributeGroupService: AttributeGroupService,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly rS: ResponseService
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.data);
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

          return this.attributeGroupService.pagination(
            page,
            limit,
            sort,
            order
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
    this.router.navigateByUrl('/dashboard/product-attribute-group/edit/' + id);
  };

  list = (id: string) => {
    this.router.navigateByUrl('/dashboard/product-attribute/list/' + id);
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
        this.attributeGroupService.remove(id).subscribe((res) => {
          this.rS.fire(res);
          this.showAll();
        });
      }
      this.dialogRef = null;
    });
  };
}
