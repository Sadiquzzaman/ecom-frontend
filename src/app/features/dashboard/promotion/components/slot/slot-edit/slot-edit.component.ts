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
import { Subject } from 'rxjs';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { PromotionType } from 'src/app/shared/enum/promotion-type.enum';

export interface DialogData {
  // isAdmin: boolean;
  dailyCharge: number;
  promotionType: number;
  limit: number;
}

@Component({
  selector: 'app-slot-edit',
  templateUrl: './slot-edit.component.html',
  styleUrls: ['./slot-edit.component.scss'],
})
export class SlotEditComponent implements OnInit {
  requestForm!: FormGroup;

  request: any;
  titleWidth = 25;
  approvalFormWidth = 70;
  PromotionType = PromotionType;
  promotionTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SlotEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public readonly token: TokenStorageService,
    private _router: Router,
    private readonly systemService: SystemService
  ) {
    this.promotionTypes = this.systemService.enumToArray(this.PromotionType, 1);
  }
  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.request = this.data.request;
    this.initForm(this.request);
  }

  initForm = (request: DialogData) => {
    this.requestForm = this.fb.group({
      promotionType: [request.promotionType, [Validators.required]],
      dailyCharge: [
        request.dailyCharge,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(0),
        ],
      ],
      limit: [
        request.limit,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(0),
          Validators.max(10),
        ],
      ],
    });
  };

  onNoClick(): void {
    this.dialogRef.close();
  }

  redirectTo(uri: string) {
    console.log(uri);
    if (this._router.url == uri) {
      this._router
        .navigateByUrl('/dashboard', { skipLocationChange: true })
        .then(() => this._router.navigate([uri]));
    }
  }
}
