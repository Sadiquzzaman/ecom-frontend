import { AccountingService } from './../../accounting.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  addBankDetailsForm!: FormGroup;
  bankList: any;
  protected _onDestroy = new Subject<void>();

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
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formInit();
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

  formInit = () => {
    this.addBankDetailsForm = this.fb.group({
      bankId: ['', [Validators.required]],
      accountHolderName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      remarks: '',
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

    this.accountingService.addBankDetails(bankDetails).subscribe((res) => {
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
