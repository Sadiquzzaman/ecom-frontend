import { RefundConfigService } from './../../refund-config.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseService } from 'src/app/shared/services/response.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  editRefundConfigForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;
  btnLabel = 'Update';
  id = '';

  constructor(
    private readonly refundConfigService: RefundConfigService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formInit(this.route.snapshot.data.refundConfig);
  }

  formInit = (refundConfig: any) => {
    this.id = refundConfig.id;
    this.editRefundConfigForm = new FormGroup({
      name: new FormControl(refundConfig?.name, Validators.required),
      description: new FormControl(
        refundConfig?.description,
        Validators.required
      ),
    });
  };

  reset = () => {
    this.editRefundConfigForm.reset();
  };

  save = () => {
    if (this.editRefundConfigForm.valid) {
      this.submit();
    }
  };

  submit = () => {
    this.isLoading = true;
    this.refundConfigService
      .update(this.id, this.editRefundConfigForm.value)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          this.editRefundConfigForm.reset();
          this.router.navigate(['/dashboard/refund-config/list']);
        } else {
          this.btnLabel = 'Try Again!';
        }
      });
  };
}
