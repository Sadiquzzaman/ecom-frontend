import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { OrderStatus } from '../../../../../../app/shared/enum/order-status.enum';
import { ImageType } from '../../../../../../app/core/enum/image-type.enum';
import { OrderService } from '../../order.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';

export interface Order {
  image: string;
  status: string;
  productDescription: ProductDescription;
  payment: string;
  total: number;
  details: string;
}

export interface ProductDescription {
  productName: string;
  quantity: string;
  date: string;
}

@Component({
  selector: 'app-history-content',
  templateUrl: './history-content.component.html',
  styleUrls: ['./history-content.component.scss'],
})
export class HistoryContentComponent
  implements AfterViewInit, AfterViewChecked, OnInit, OnChanges
{
  status: number;
  isHidden: number;
  productImageType = ImageType.PRODUCT_SMALL;
  orderId: string | null = null;
  totalPrice: any;
  orderDetails: any;
  shippingcharge = 40;

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('status') set statusInit(input: number) {
    this.status = input;
  }
  @Input('isHidden') set isHiddenInit(input: number) {
    this.isHidden = input;
  }

  displayedColumns: string[] = [
    // 'image',
    'seriall no.',
    'date',
    '_totalItems',
    'invoiceTotal',
    'delivery-history',
    '_orderDetails',
    'invoice',
    'status',
  ];
  dataSource: any[] = [];

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  OrderStatus = OrderStatus;

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
    private readonly orderService: OrderService,
    private readonly cdRef: ChangeDetectorRef,
    public readonly token: TokenStorageService,
    private readonly matDialog: MatDialog
  ) {
    if (this.token.isAdmin()) {
      this.displayedColumns.push('actions');
      this.displayedColumns.splice(4, 0, 'customer');
    }
  }

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.sort) this.showAll();
  }

  showAll() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    if (this.status == this.isHidden) {
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.pagination.isLoading = true;
            const page = this.paginator.pageIndex + 1;
            const limit = this.paginator.pageSize;
            const sort = this.sort?.active || 'updatedAt';
            const order = this.sort?.direction.toUpperCase() || 'DESC';

            return this.orderService.pagination(
              page,
              limit,
              sort,
              order,
              this.status,
              this.fromDate,
              this.toDate
            );
          }),
          map((res) => {
            const { count, data } = res.page;
            this.pagination.isLoading = false;
            this.pagination.totalCount = count;

            let i = 0;
            for (const item of data) {
              data[i]._totalPrice = item?.orderDetails.reduce(
                (acc: number, current: any) =>
                  acc +
                  (Number(current?.price || 0) * current.quantity +
                    (current.productAttribute.additionalShippingCost +
                      this.shippingcharge)) -
                  current.productAttribute.discount,
                0
              );
              data[i]._totalItems = item?.orderDetails.reduce(
                (acc: number, current: any) => acc + current.quantity,
                0
              );
              data[i]._orderDetails = 'Order Details';
              i++;
            }
            return data;
          }),
          catchError(() => {
            this.pagination.isLoading = false;
            return of([]);
          })
        )
        .subscribe((data) => {
          console.log(data);

          // console.log(data);
          // for (const test of data) {
          //   for (const test2 of test.orderDetails) {
          //     this.orderDetails = test2.productAttribute;
          //     console.log(this.orderDetails);
          //   }
          // }
          // this.totalPrice = this.orderDetails.quantity * this.orderDetails.price;
          // console.log(this.totalPrice)

          this.dataSource = data;
          // console.log('this.dataSource',this.dataSource);
        });
    }
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
    this.showAll();
  };

  toFixedNumber = (value: string | number): number =>
    Number(Number(value.toString()).toFixed(2));

  changeStatus(id: string, status: number) {
    const statusDto = { status };
    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure to confirm the order?',
        message: 'This can`t be undone',
      },
    });

    this.dialogRef.afterClosed().subscribe((yes) => {
      if (yes) {
        this.orderService.changeStatusByID(id, statusDto).subscribe((res) => {
          // console.log(res);
          this.showAll();
        });
      }
      this.dialogRef = null;
    });
  }
}
