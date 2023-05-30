import { TransporterRefundService } from './../../transporter-refund.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { ResponseService } from 'src/app/shared/services/response.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { Location } from '@angular/common';
import { ImageType } from 'src/app/core/enum/image-type.enum';
import { SystemService } from 'src/app/shared/services/system.service';

@Component({
  selector: 'app-received-refund-details',
  templateUrl: './received-refund-details.component.html',
  styleUrls: ['./received-refund-details.component.scss'],
})
export class ReceivedRefundDetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'checkbox',
    'refundRequestDate',
    'product',
    // 'refundPickedQuantity',
    // 'approve_quantity',
    'refundReason',
  ];
  dataSource: any = new MatTableDataSource();
  data: any = [];
  refundApproveForm!: FormGroup;
  refundId: string;
  refundStatus: string = '0';
  refundRequestStatus: number = 1;
  assignStatus: number = 2;

  pagination = {
    isLoading: false,
    rowsPerPage: 10,
    totalCount: 0,
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  selection = new SelectionModel<any>(true, []);
  imageType = ImageType.PRODUCT_SMALL;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly transporterRefundService: TransporterRefundService,
    private readonly snackBarService: ResponseService,
    private readonly systemService: SystemService,
    private formBuilder: FormBuilder,
    private router: Router,
    private readonly token: TokenStorageService,
    private location: Location,
    private readonly matDialog: MatDialog
  ) {
    this.refundStatus =
      this.router.getCurrentNavigation()?.extras?.state?.refundStatus;

    if (this.refundStatus == '0') {
      console.log(this.refundStatus);
      this.refundRequestStatus = 1;
      this.assignStatus = 2;
      this.displayedColumns.splice(
        3,
        0,
        'refundRequestQuantity',
        'reviewed_quantity'
      );
    }

    if (this.refundStatus == '1') {
      console.log(this.refundStatus);
      this.refundRequestStatus = 2;
      this.assignStatus = 3;
      this.displayedColumns.splice(
        3,
        0,
        'refundPickedQuantity',
        'approve_quantity'
      );
    }
  }

  ngOnInit(): void {
    if (!this.token.isAdmin()) {
      this.router.navigate([this.token.DASHBOARD]);
    }
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
          return this.transporterRefundService.findByID(
            this.refundId,
            this.refundStatus
          );
        })
      )
      .subscribe((res) => {
        this.data = res?.payload?.data?.refundRequestDetails;
        // console.log(this.data);
        if (this.data) {
          this.dataSource = this.data.filter((ele: any) => {
            ele['approve_quantity'] = 0;
            if (this.refundStatus == '1') {
              // console.log(ele['refundPickedQuantity']);
              if (ele['refundPickedQuantity'] > 0) return ele;
            } else {
              return ele;
            }
          });
          // console.log(this.dataSource);
        } else {
          this.dataSource = [];
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
    // if(this.refundStatus == '1'){
    //   this.refundRequestStatus = 1;
    //   this.assignStatus = 2;
    // }

    this.refundApproveForm = this.formBuilder.group({
      refundRequestStatus: [this.refundRequestStatus, Validators.required],
      refundProductQuantity: this.formBuilder.array([]),
      assignStatus: [this.assignStatus, Validators.required],
    });
  };

  productAttributeExtractor = (reference: any) => {
    return this.systemService.attributeExtractor(reference);
  };

  logSelection() {
    if (!this.selection.selected.length) {
      this.snackBarService.message('Select at least one item first !!!');
      return;
    }
    if (!this.refundApproveForm.valid) {
      this.snackBarService.message('Fill all the required fields !!!');
      return;
    }

    (<FormArray>this.refundApproveForm.get('refundProductQuantity')).clear();

    let invalid = false;

    this.selection.selected.forEach((data) => {
      if (
        !data.hasOwnProperty('approve_quantity') ||
        data['approve_quantity'] == 0
      ) {
        // console.log(data);
        invalid = true;
        this.snackBarService.message(
          'Select Approve Quantity for all selected items !!!'
        );
        return;
      }

      this.getAdditionalInfo(data.id, data.approve_quantity);
    });

    if (invalid) {
      return;
    }

    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure to approve the selected items?',
        message: 'This can`t be undone',
      },
    });

    this.dialogRef.afterClosed().subscribe((yes) => {
      if (yes) {
        this.pagination.isLoading = true;
        console.log(this.refundApproveForm.value);
        this.transporterRefundService
          .approveRefundRequest(this.refundId, this.refundApproveForm.value)
          .subscribe(
            (res) => {
              this.pagination.isLoading = false;
              if (this.snackBarService.fire(res)) {
                this.refundApproveForm.reset();
                if (this.refundStatus == '0') {
                  this.router.navigate([
                    '/dashboard/refund/refund-request-list',
                  ]);
                }
                if (this.refundStatus == '1') {
                  this.router.navigate([
                    '/dashboard/transporter-refund/received-refund-list',
                  ]);
                }
              }
            },
            (err) => {
              this.pagination.isLoading = false;
            }
          );
      }
      this.dialogRef = null;
    });
  }

  reject() {
    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure to reject all items?',
        message: 'This can`t be undone',
      },
    });

    this.dialogRef.afterClosed().subscribe((yes) => {
      if (yes) {
        this.pagination.isLoading = true;
        this.transporterRefundService
          .rejectRefundRequest(this.refundId, { step: parseInt(this.refundStatus) })
          .subscribe(
            (res) => {
              this.pagination.isLoading = false;
              if (this.snackBarService.fire(res)) {
                this.refundApproveForm.reset();
                if (this.refundStatus == '0') {
                  this.router.navigate([
                    '/dashboard/refund/refund-request-list',
                  ]);
                }
                if (this.refundStatus == '1') {
                  this.router.navigate([
                    '/dashboard/transporter-refund/received-refund-list',
                  ]);
                }
              }
              // this.getData();
            },
            (err) => {
              this.pagination.isLoading = false;
            }
          );
      }
      this.dialogRef = null;
    });
  }

  cancel() {
    this.location.back(); // <-- go back to previous location on cancel
  }
}
