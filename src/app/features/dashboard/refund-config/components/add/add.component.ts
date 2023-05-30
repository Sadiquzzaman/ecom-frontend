import { RefundConfigService } from './../../refund-config.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseService } from 'src/app/shared/services/response.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  addRefundConfigForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private readonly refundConfigService: RefundConfigService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.formInit();
  }

  formInit = () => {
    this.addRefundConfigForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  };

  reset = () => {
    this.addRefundConfigForm.reset();
  };

  save = () => {
    if (this.addRefundConfigForm.valid) {
      this.submit();
    }
  };

  submit = () => {
    this.refundConfigService
      .create(this.addRefundConfigForm.value)
      .subscribe((res) => {
        this.isSubmitted = false;
        if (this.snackBarService.fire(res)) {
          this.addRefundConfigForm.reset();
          this.router.navigate(['/dashboard/refund-config/list']);
        }
      });
  };
}
