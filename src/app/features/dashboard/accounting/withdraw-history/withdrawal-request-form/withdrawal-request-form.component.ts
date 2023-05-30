import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ImageSnippetDto } from 'src/app/core/dto/image.dto';
import { ImageType } from 'src/app/core/enum/image-type.enum';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';
import { ResponseService } from 'src/app/shared/services/response.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { WithdrawService } from '../../withdraw.service';

export interface DialogData {
  // isAdmin: boolean;
  isForm: boolean;
  request: any;
  availableBalance: number;
}

@Component({
  selector: 'app-withdrawal-request-form',
  templateUrl: './withdrawal-request-form.component.html',
  styleUrls: ['./withdrawal-request-form.component.scss'],
})
export class WithdrawalRequestFormComponent implements OnInit {
  requestForm!: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  minStartDate = new Date();

  banks: any[];
  isBankSearching = false;
  bankFiltering: FormControl = new FormControl();
  bankOptions: Array<{
    id: string;
    bankName: string;
  }> = [];
  filteredBankOptions = new ReplaySubject<
    {
      id: string;
      bankName: string;
    }[]
  >(1);

  accounts: any[];
  isAccountSearching = false;
  accountFiltering: FormControl = new FormControl();
  accountOptions: Array<{
    id: string;
    accountNumber: string;
  }> = [];
  filteredAccountOptions = new ReplaySubject<
    {
      id: string;
      accountNumber: string;
    }[]
  >(1);

  accountSelected: any;
  accountHolderName: string = '';
  request: any;
  titleWidth = 25;
  approvalFormWidth = 70;
  availableBalance: number = 0;
  balanceRemains: number = 0;

  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  /**************** image *******************/
  selectedFile!: ImageSnippetDto;
  categoryImageName = '';
  imageError = false;
  imageType = ImageType.PAYMENT;

  constructor(
    private fb: FormBuilder,
    private readonly withdrawService: WithdrawService,
    public dialogRef: MatDialogRef<WithdrawalRequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public readonly token: TokenStorageService,
    private readonly matDialog: MatDialog,
    private readonly systemService: SystemService,
    private readonly rS: ResponseService,
    private _router: Router
  ) {}
  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.request = this.data.request;
    this.availableBalance = this.data.availableBalance;

    console.log(this.request);

    if (this.data.isForm) {
      if (this.token.isMerchant()) {
        this.initForm(this.data);
        this.withdrawService.getMerchantBanks().subscribe((res) => {
          this.banks = res;
          this.bankOptions = this.banks;
          this.filteredBankOptions.next(this.bankOptions);
          this.filterBank();
        });

        this.withdrawService.getMerchantAccounts().subscribe((res) => {
          this.accounts = res;
          this.accountOptions = this.accounts;
          this.filteredAccountOptions.next(this.accountOptions);
          this.filterAccount();
        });
      } else {
        this.approvalForm(this.data);
      }
    }
  }

  approvalForm = (data: DialogData) => {
    // console.log(data.availableBalance);

    this.requestForm = this.fb.group({
      withdrawalStatus: [1, [Validators.required]],
      rejectReason: '',
      attachedDocument: ['', [Validators.required]],
      remarks: '',
      transactionId: ['', [Validators.required]],
      paidAmount: [
        this.request.amount,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(500),
          Validators.max(this.request.amount),
        ],
      ],
    });

    this.balanceCalculation();
  };

  balanceCalculation = () => {
    this.balanceRemains =
      this.data.availableBalance -
      this.requestForm.controls.requestedAmount.value;
    return this.balanceRemains;
  };

  initForm = (data: DialogData) => {
    this.requestForm = this.fb.group({
      bankId: ['', [Validators.required]],
      bankDetailsId: ['', [Validators.required]],
      requestedAmount: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(500),
          Validators.max(data.availableBalance),
        ],
      ],
    });
  };

  filterBank = () => {
    this.bankFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isBankSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.bankOptions) {
            return [];
          }
          return this.bankOptions.filter(
            (banks) =>
              banks.bankName.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isBankSearching = false;
          this.filteredBankOptions.next(filtered);
        },
        () => {
          this.isBankSearching = false;
        }
      );
  };

  filterAccount = () => {
    this.accountFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isAccountSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.accountOptions) {
            return [];
          }
          return this.accountOptions.filter(
            (accounts) =>
              accounts.accountNumber
                .toLowerCase()
                .indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isAccountSearching = false;
          this.filteredAccountOptions.next(filtered);
        },
        () => {
          this.isAccountSearching = false;
        }
      );
  };

  onBankChange = () => {
    let bankId = this.requestForm.controls.bankId.value;
    this.requestForm.controls.bankDetailsId.setValue('');
    // console.log(bankId);

    if (bankId) {
      this.accountOptions = this.accounts.filter(
        (account) => account.banks.id == bankId
      );
      this.filteredAccountOptions.next(this.accountOptions);
    }
  };

  onAccountChange = () => {
    let bankDetailsId = this.requestForm.get('bankDetailsId')?.value;
    // console.log(bankDetailsId);

    if (bankDetailsId) {
      this.accountSelected = this.accounts.filter(
        (account) => account.id == bankDetailsId
      );
      this.accountHolderName = this.accountSelected[0]['accountHolderName'];
      // console.log(this.accountSelected);
      console.log(this.accountHolderName);
    }
  };

  onNoClick(): void {
    this.dialogRef.close();
  }

  setValidation = (withdrawalStatus: number = 1) => {
    const remarks = this.requestForm.controls.remarks;
    const rejectReason = this.requestForm.controls.rejectReason;
    const paidAmount = this.requestForm.controls.paidAmount;
    const transactionId = this.requestForm.controls.transactionId;
    const attachedDocument = this.requestForm.controls.attachedDocument;

    if (withdrawalStatus == 1) {
      rejectReason.setValue('');
      rejectReason.clearValidators();
      transactionId.setValidators([Validators.required]);
      attachedDocument.setValidators([Validators.required]);
      paidAmount.setValue(this.request.amount);
      paidAmount.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(5),
        Validators.max(this.availableBalance),
      ]);
    } else {
      remarks.setValue('');
      transactionId.setValue('');
      transactionId.clearValidators();
      attachedDocument.setValue('');
      attachedDocument.clearValidators();
      paidAmount.setValue(0);
      paidAmount.clearValidators();
      rejectReason.setValidators([Validators.required]);
    }

    transactionId.updateValueAndValidity();
    attachedDocument.updateValueAndValidity();
    paidAmount.updateValueAndValidity();
    rejectReason.updateValueAndValidity();
  };

  /********************** image ************************/
  waitForImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippetDto(event.target.result, file);
      this.withdrawService.uploadImageRedis(this.selectedFile.file).subscribe(
        (res) => {
          this.categoryImageName = res.filename;
          this.requestForm.controls.attachedDocument.setValue(
            this.categoryImageName
          );
        },
        (err) => {
          console.log(err);
        }
      );
      this.imageError = false;
    });
    reader.readAsDataURL(file);
  };

  saveProfileImage = () => {
    this.withdrawService.uploadImage(this.categoryImageName).subscribe(() => {
      console.log('Image uploaded to server successfully');
    });
  };

  changeStatus = (id: string, status: number) => {
    const statusDto = { withdrawalStatus: status };
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure to cancel the request?',
        message: 'This can`t be undone',
      },
    });

    this.confirmDialogRef.afterClosed().subscribe((yes) => {
      if (yes) {
        // this.pagination.isLoading = true;
        this.withdrawService
          .cancelWithdrawRequest(id, statusDto)
          .subscribe((res) => {
            this.rS.fire(res);
            this.redirectTo('/dashboard/accounting/merchant-withdrawals');
            // this.dialogRef = null;
            this.dialogRef.close();

            // this.showAll();
          });
      }
      this.confirmDialogRef = null;
    });
  };

  redirectTo(uri: string) {
    console.log(uri);
    if (this._router.url == uri) {
      this._router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => this._router.navigate([uri]));
    }
  }
}
