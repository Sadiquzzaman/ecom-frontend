import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';
import { ImageType } from 'src/app/core/enum/image-type.enum';
import { RefundService } from 'src/app/shared/services/refund.service';
import { SystemService } from 'src/app/shared/services/system.service';

export interface DialogData {
  refundId: string;
  status: string;
}

@Component({
  selector: 'app-approved-details',
  templateUrl: './approved-details.component.html',
  styleUrls: ['./approved-details.component.scss'],
})
export class ApprovedDetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'product',
    'price',
    'refundReason',
    'refundRequestQuantity',
  ];
  dataSource: any = new MatTableDataSource();
  refundId: string;
  refundPickedDate: string = '';
  refundRequestDate: string = '';
  refundApprovedDate: string = '';
  imageType = ImageType.PRODUCT_SMALL;

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // isLoading: boolean;

  constructor(
    public dialogRef: MatDialogRef<ApprovedDetailsComponent>,
    private readonly activatedRoute: ActivatedRoute,
    private readonly refundService: RefundService,
    private readonly systemService: SystemService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // console.log(data);

    if (data.status == '1' || data.status == '2') {
      this.displayedColumns.splice(4, 0, 'refundPickedQuantity');
    } else if (data.status == '3') {
      this.displayedColumns.splice(
        4,
        0,
        'refundPickedQuantity',
        'refundApprovedQuantity'
      );
    } else {
      this.displayedColumns.splice(
        4,
        0,
        'refundPickedQuantity'
        // 'refundApprovedQuantity'
      );
    }
  }

  ngOnInit(): void {
    this.pagination.isLoading = true;
    console.log(this.data);
    this.getData(this.data);
  }

  getData = (data: DialogData) => {
    this.refundService
      .findByID(data.refundId, data.status)
      // .pipe(delay(500000))
      .subscribe(
        (res) => {
          console.log(res);
          this.pagination.isLoading = false;

          let dataSource = res?.payload?.data?.refundRequestDetails;

          this.dataSource = dataSource.map((element: any) => {
            this.refundRequestDate = element.refundRequestDate;

            if (data.status == '1' || data.status == '2') {
              console.log(data.status);
              if (element.refundPickedQuantity > 0) {
                this.refundPickedDate = element.refundPickedDate;
              }
              return element;
            } else if (data.status == '3') {
              console.log(data.status);
              if (element.refundApprovedQuantity > 0) {
                this.refundPickedDate = element.refundPickedDate;
                this.refundApprovedDate = element.refundApprovedDate;
              }
              return element;
            } else {
              console.log(data.status);
              // if (element.refundRequestQuantity > 0) return element;
              return element;
            }
            return;
          });

          console.log(this.dataSource);

          // this.dataSource = res?.payload?.data?.refundRequestDetails;
        },
        () => {
          this.pagination.isLoading = false;
        }
      );
  };

  productAttributeExtractor = (reference: any) => {
    return this.systemService.attributeExtractor(reference);
  };

  close(): void {
    this.dialogRef.close();
  }
}
