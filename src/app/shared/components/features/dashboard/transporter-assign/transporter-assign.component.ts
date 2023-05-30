import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { RefundService } from 'src/app/shared/services/refund.service';

export interface DialogData {
  refundRequestId: string;
  refundApprovalId: string;
}

@Component({
  selector: 'app-transporter-assign',
  templateUrl: './transporter-assign.component.html',
  styleUrls: ['./transporter-assign.component.scss'],
})
export class TransporterAssignComponent implements OnInit {
  deliveryAssignForm!: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  minStartDate = new Date();
  transporters: any[];
  isTransporterSearching = false;
  transporterFiltering: FormControl = new FormControl();
  transportersOptions: Array<{
    id: string;
    firstName: string;
    lastName: string;
    phone: number;
    email: string;
  }> = [];
  filteredtransportersOptions: ReplaySubject<
    {
      id: string;
      firstName: string;
      lastName: string;
      phone: number;
      email: string;
    }[]
  > = new ReplaySubject<
    {
      id: string;
      firstName: string;
      lastName: string;
      phone: number;
      email: string;
    }[]
  >(1);

  constructor(
    private readonly refundService: RefundService,
    public dialogRef: MatDialogRef<TransporterAssignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.initForm(this.data);

    this.refundService.getAllTransporters().subscribe((res) => {
      this.transporters = res;
      this.transportersOptions = this.transporters;
      this.filteredtransportersOptions.next(this.transportersOptions);
      this.filterTransporter();
    });
  }

  initForm = (data: DialogData) => {
    this.deliveryAssignForm = new FormGroup({
      refundRequestId: new FormControl(data.refundRequestId, [
        Validators.required,
      ]),
      transporterId: new FormControl(null, [Validators.required]),
      expectedPickUpDate: new FormControl(null, [Validators.required]),
      refundApprovalId: new FormControl(data.refundApprovalId),
    });
  };

  filterTransporter = () => {
    this.transporterFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isTransporterSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.transportersOptions) {
            return [];
          }
          return this.transportersOptions.filter(
            (transporters) =>
              transporters.firstName
                .toLowerCase()
                .indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isTransporterSearching = false;
          this.filteredtransportersOptions.next(filtered);
        },
        () => {
          this.isTransporterSearching = false;
        }
      );
  };

  onNoClick(): void {
    this.dialogRef.close();
  }
}
