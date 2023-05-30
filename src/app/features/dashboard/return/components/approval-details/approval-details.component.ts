import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ReturnService } from '../../return.service';

export interface DialogData {
  refundApprovalId: string;
}

@Component({
  selector: 'app-approval-details',
  templateUrl: './approval-details.component.html',
  styleUrls: ['./approval-details.component.scss'],
})
export class ApprovalDetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'product',
    'refundReason',
    'refundRequestDate',
    'quantity',
  ];
  dataSource: any = new MatTableDataSource();
  refundId: string;

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ApprovalDetailsComponent>,
    private readonly activatedRoute: ActivatedRoute,
    private readonly returnService: ReturnService,

    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.getData(this.data);
  }

  getData = (data: DialogData) => {
    console.log(data);

    this.returnService
      .findApprovalDetailsByID(data.refundApprovalId)
      .subscribe((res) => {
        console.log(res);

        this.dataSource = res?.payload?.data;
      });
  };

  productAttributeExtractor = (reference: any) => {
    let splittedParts = reference.split('-', 3);
    let productAttributes = splittedParts[1] + ', ' + splittedParts[2];
    return productAttributes;
  };

  close(): void {
    this.dialogRef.close();
  }
}
