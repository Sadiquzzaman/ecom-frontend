import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, tap } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { ResponseService } from 'src/app/shared/services/response.service';
import { RefundService } from './../../refund.service';

@Component({
  selector: 'app-refund-request-details',
  templateUrl: './refund-request-details.component.html',
  styleUrls: ['./refund-request-details.component.scss'],
})
export class RefundRequestDetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'checkbox',
    'refundRequestDate',
    'product',
    'refundRequestQuantity',
    'approve_quantity',
    'refundReason',
  ];
  dataSource: any = new MatTableDataSource();
  data: any = [];
  refundApproveForm!: FormGroup;
  refundId: string;

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  selection = new SelectionModel<any>(true, []);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly refundService: RefundService,
    private formBuilder: FormBuilder,
    private readonly rS: ResponseService,
    private readonly router: Router,
    private readonly token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getData();
  }

  getData = () => {
    this.activatedRoute.params
      .pipe(
        tap((returnRequest) => {
          this.refundId = returnRequest.id;
        }),
        concatMap(() => {
          return this.refundService.findByID(this.refundId, '0');
        })
      )
      .subscribe((res) => {
        this.data = res?.payload?.data?.refundRequestDetails;
        if (this.data) {
          this.dataSource = this.data.map((ele: any) => {
            ele['approve_quantity'] = 0;
            return ele;
          });
        } else {
          this.data = [];
        }
      });
  };

  changeQuantity = ($event: any, row: any) => {
    let value = $event.value;
    row['approve_quantity'] = value;
    let id = row['id'];
    this.dataSource.map((ele: any) => {
      if (ele.id == id) {
        ele['approve_quantity'] = value;
      }
      return ele;
    });
  };

  getAdditionalInfo(refundId: '', quantity: number) {
    let additionalInfos = this.refundApproveForm.get(
      'refundProductQuantity'
    ) as FormArray;

    additionalInfos.push(
      this.formBuilder.group({
        refundRequestDetailId: [refundId, Validators.required],
        quantity: quantity,
      })
    );
  }

  initForm = () => {
    this.refundApproveForm = this.formBuilder.group({
      refundRequestStatus: [1, Validators.required],
      refundProductQuantity: this.formBuilder.array([]),
      assignStatus: [2, Validators.required],
    });
  };

  productAttributeExtractor = (reference: any) => {
    let splittedParts = reference.split('-', 3);
    let productAttributes = splittedParts[1] + ', ' + splittedParts[2];
    return productAttributes;
  };

  logSelection() {
    (<FormArray>this.refundApproveForm.get('refundProductQuantity')).clear();

    if (!this.selection.selected.length) {
      this.rS.message('Select at least one item first !!!');
      return;
    }

    if (!this.refundApproveForm.valid) {
      this.rS.message('Fill all the required fields !!!');
      return;
    }

    let invalid = false;

    this.selection.selected.forEach((data) => {
      if (
        !data.hasOwnProperty('approve_quantity') ||
        data['approve_quantity'] == 0
      ) {
        invalid = true;
        this.rS.message('Select Approve Quantity for all selected items !!!');
        return;
      }

      this.getAdditionalInfo(data.id, data.approve_quantity);
    });

    if (invalid) {
      return;
    }

    // this.selection.selected.forEach((data) => {
    //   this.getAdditionalInfo(data.id, data.approve_quantity);
    // });
    // console.log(this.refundApproveForm.value);

    this.refundService
      .approveRefundRequest(this.refundId, this.refundApproveForm.value)
      .subscribe((res) => {
        this.rS.fire(res);
        this.router.navigate(['/dashboard/refund/refund-request-list']);
        this.getData();
      });
  }
}
