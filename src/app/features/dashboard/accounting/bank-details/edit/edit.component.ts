import { AccountingService } from './../../accounting.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseService } from 'src/app/shared/services/response.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  addBankDetailsForm!: FormGroup;
  bankList: any;
  protected _onDestroy = new Subject<void>();
  id = '';

  bankId = null;
  isBankSearching = false;
  bankFiltering: FormControl = new FormControl();
  bankOptions: Array<{ id: string; bankName: string }> = [];
  filteredBankOptions: ReplaySubject<{ id: string; bankName: string }[]> =
    new ReplaySubject<{ id: string; bankName: string }[]>(1);

  constructor(
    private readonly accountingService: AccountingService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.data?.bankDetail);

    this.formInit(this.route.snapshot.data?.bankDetail);
    const banks = this.route?.snapshot?.data?.banks;
    const allBanks = banks.map((bank: any) => ({
      id: bank.id,
      bankName: bank.bankName,
    }));
    if (allBanks?.length > 0) {
      this.bankOptions = allBanks;
    } else {
      this.bankOptions = [];
    }
    this.filteredBankOptions.next(this.bankOptions);

    this.fetchAllBanks();
  }

  formInit = (bankDetail: any) => {
    this.id = bankDetail.id;
    this.addBankDetailsForm = new FormGroup({
      bankId: new FormControl(bankDetail?.banks?.id, Validators.required),
      accountHolderName: new FormControl(
        bankDetail.accountHolderName,
        Validators.required
      ),
      accountNumber: new FormControl(
        bankDetail.accountNumber,
        Validators.required
      ),
      remarks: new FormControl(bankDetail.remarks, Validators.required),
    });
  };

  fetchAllBanks = () => {
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
            (bank) =>
              bank.bankName.toLowerCase().indexOf(search.toLowerCase()) > -1
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

  save = () => {
    if (this.addBankDetailsForm.valid) {
      this.saveData();
    } else {
      console.log('Invalid');
    }
  };

  saveData = () => {
    const bankDetails = this.addBankDetailsForm.value;
    console.log(bankDetails);

    this.accountingService
      .updateBankDetail(this.id, bankDetails)
      .subscribe((res) => {
        if (this.snackBarService.fire(res)) {
          this.addBankDetailsForm.reset();
          this.router.navigate(['/dashboard/accounting/bank-details/list']);
        }
      });
  };

  resetForm = () => {
    this.addBankDetailsForm.reset();
  };
}
