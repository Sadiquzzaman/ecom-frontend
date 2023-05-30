import { HttpResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  AfterViewChecked,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ResponseService } from 'src/app/shared/services/response.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { WithdrawService } from '../../withdraw.service';

import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { WithdrawalRequestFormComponent } from '../withdrawal-request-form/withdrawal-request-form.component';
import { ActivatedRoute } from '@angular/router';
//import { WithdrawalRequestDetailsComponent } from '../withdrawal-request-details/withdrawal-request-details.component';

@Component({
  selector: 'app-merchant-withdrawals',
  templateUrl: './merchant-withdrawals.component.html',
  styleUrls: ['./merchant-withdrawals.component.scss'],
})
export class MerchantWithdrawalsComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  displayedColumns: string[] = [
    'updatedAt',
    'createAt',
    'status',
    // 'requestedAmount',
    // 'orderId',
    'details',
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

  gap: string = '5px';
  fromDate: string;
  toDate: string;
  entity = '';
  entityId: string = '';
  secondEntity = '';
  secondEntityId: string = '';
  dropdownName = '';
  dropdownId: string = '';
  secondDropdownName = '';
  secondDropdownId: string = '';
  isAdmin = true;
  multipleRow = false;
  assignStatus = '1';

  entityFlex = 40;
  secondEntityFlex = 30;
  dropdownFlex = 25;
  secondDropdownFlex = 30;
  from_dateFlex = 25;
  to_dateFlex = 25;

  invoiceId: string;
  availableBalance: number = 0;
  totalSale: number = 0;
  totalRefund: number = 0;
  totalWithdrawal: number = 0;
  totalPendingWithdrawal: number = 0;

  constructor(
    private withdrawService: WithdrawService,
    private readonly cdRef: ChangeDetectorRef,
    public readonly token: TokenStorageService,
    private readonly rS: ResponseService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private readonly systemService: SystemService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.token.isMerchant()) {
      this.availableBalanace();
      // this.banks();
      // this.bankDetails();
      this.isAdmin = false;
      this.dropdownName = 'Withdraw Status';
      this.displayedColumns.splice(2, 0, 'requestedAmount', 'approvedAmount');
    } else {
      this.from_dateFlex = 20;
      this.to_dateFlex = 20;
      this.dropdownFlex = 20;
      this.dropdownName = 'Withdraw Status';
      this.entity = 'merchant';
      this.displayedColumns.splice(
        2,
        0,
        'merchant',
        'requestedAmount',
        'approvedAmount'
      );

      // this.route.data
      //   .pipe(map((res) => res.withdrawalStatus))
      //   .subscribe((res) => {
      //     this.dropdownId = res;
      //     console.log(this.dropdownId);
      //   });
      // this.displayedColumns.splice(5, 0, 'orderId');
    }
  }

  initForm = () => {
    this.entityId = '';
    this.fromDate = '';
    this.toDate = '';
  };

  availableBalanace = (merchantId: string = '', request: any = {}) => {
    this.withdrawService.availableBalanace(merchantId).subscribe((res) => {
      this.availableBalance = res?.availableBalance;
      this.totalSale = res?.totalSale;
      this.totalRefund = res?.totalRefund;
      this.totalWithdrawal = res?.totalWithdrawal;
      this.totalPendingWithdrawal = res?.totalPendingWithdrawal;
      if (merchantId) {
        this.approvalDialog(request);
      }
    });
  };

  banks = () => {
    this.withdrawService.getBanks().subscribe((res) => {
      this.banks = res;
    });
  };

  bankDetails = () => {
    this.withdrawService.getMerchantAccounts().subscribe((res) => {
      this.bankDetails = res;
    });
  };

  ngAfterViewInit(): void {
    this.showAll();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  showAll = () => {
    merge(
      this.paginator.page,
      this.sort.sortChange.pipe(tap(() => (this.paginator.pageIndex = 0)))
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.pagination.isLoading = true;
          const page = this.paginator.pageIndex + 1;
          const limit = this.paginator.pageSize;
          const sort = this.sort?.active || 'updatedAt';
          const order = this.sort?.direction.toUpperCase() || 'DESC';

          return this.withdrawService.withdrawalPagination(
            page,
            limit,
            sort,
            order,
            this.isAdmin,
            this.dropdownId,
            this.entityId,
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
      .subscribe((data) => {
        //console.log(data);
        this.dataSource = data;
      });
  };

  submittedSearch = ($event: any) => {
    // console.log($event);
    const {
      entityId,
      secondEntityId,
      dropdownId,
      secondDropdownId,
      fromDate,
      toDate,
    } = $event;
    this.entityId = entityId;
    this.secondEntityId = secondEntityId;
    this.dropdownId = dropdownId;
    this.secondDropdownId = secondDropdownId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.showAll();
  };

  exportFile = (fileExtension: string) => {
    //this.pagination.isLoading = true;
    const page = this.paginator.pageIndex + 1;
    const limit = this.paginator.pageSize;
    const sort = this.sort?.active || 'updatedAt';
    const order = this.sort?.direction.toUpperCase() || 'DESC';

    if (this.isAdmin) {
      this.withdrawService.merchantSalesFileForAdmin(
        page,
        limit,
        sort,
        order,
        this.entityId,
        this.fromDate,
        this.toDate,
        fileExtension
      );
    } else {
      this.withdrawService.merchantSalesFileForMerchant(
        page,
        limit,
        sort,
        order,
        this.entityId,
        this.fromDate,
        this.toDate,
        fileExtension
      );
    }
  };

  withdrawRequestForm(): void {
    const dialogRef = this.dialog.open(WithdrawalRequestFormComponent, {
      width: '25rem',
      data: {
        request: {},
        // isAdmin: false,
        isForm: true,
        availableBalance: this.availableBalance,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (!result) {
        return;
      }

      let formData = {
        requestedAmount: null,
        bankDetailsId: '',
      };

      formData.requestedAmount = result.requestedAmount;
      formData.bankDetailsId = result.bankDetailsId;

      // console.log(formData);

      if (formData.requestedAmount && formData.bankDetailsId) {
        this.withdrawService
          .createWithdrawRequest(formData)
          .subscribe((res) => {
            this.rS.fire(res);
            this.showAll();
            if (this.token.isMerchant()) {
              this.availableBalanace();
            }
          });
      } else {
        this.rS.message('Please, fill up all the input fields');
      }
    });
  }

  withdrawRequestApproval(request: any): void {
    if (request.withdrawalStatus == 0) {
      this.availableBalanace(request?.requestedBy?.id, request);
    } else {
      this.approvalDialog(request);
    }
  }

  approvalDialog = (request: any) => {
    const dialogRef = this.dialog.open(WithdrawalRequestFormComponent, {
      width: '50rem',
      maxHeight: '90vh',
      data: {
        request: request,
        // isAdmin: true,
        isForm: request.withdrawalStatus == 0 ? true : false,
        availableBalance: this.availableBalance,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (!result) {
        return;
      }

      let formData: any = result;
      formData.paidAmount = parseInt(formData.paidAmount);

      if (formData.withdrawalStatus == 1) {
        if (formData.attachedDocument == '') {
          this.rS.message('Please, add the attachment of payment screenshot');
          return;
        } else {
          this.saveAttachedDocument(formData.attachedDocument);
        }

        // if (formData.paidAmount > this.availableBalance) {
        //   this.rS.message(
        //     'Paid Amount is greater than the merchant available balance.'
        //   );
        //   return;
        // }
      }

      this.withdrawService
        .updateWithdrawRequest(request.id, formData)
        .subscribe((res) => {
          this.rS.fire(res);
          this.showAll();
          // if (this.token.isMerchant()) {
          //   this.availableBalanace();
          // }
        });

      // console.log(formData);
    });
  };

  saveAttachedDocument = (image: any) => {
    this.withdrawService.uploadImage(image).subscribe(() => {
      console.log('Image uploaded to server successfully');
    });
  };

  withdrawRequestDetails(request: any): void {
    // this.invoiceId = invoice;
    const dialogRef = this.dialog.open(WithdrawalRequestFormComponent, {
      width: '50rem',
      maxHeight: '90vh',
      data: {
        request: request,
        // isAdmin: false,
        isForm: false,
        availableBalance: this.availableBalance,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      //console.log('The dialog was closed');
    });
  }
}
