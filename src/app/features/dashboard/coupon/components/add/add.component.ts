import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from 'src/app/shared/services/system.service';
import { CouponService } from '../../coupon.service';
import { ResponseService } from './../../../../../shared/services/response.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  couponForm!: FormGroup;
  minDate = new Date();
  minStartDate = new Date();
  shop: string[] = [];
  product: string[] = [];
  category: string[] = [];
  user: string[] = [];
  thana: string[] = [];

  numericPatternError: string = 'Give only numeric value';
  integerPatternError: string = 'Give only integer value';

  constructor(
    private readonly couponService: CouponService,
    private route: ActivatedRoute,
    private readonly snackBarService: ResponseService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private systemService: SystemService
  ) {}

  ngOnInit(): void {
    const shopIdsStr = localStorage.getItem('cdk-shop-list');
    if (shopIdsStr) {
      this.shop = JSON.parse(shopIdsStr);
    }

    const productIdsStr = localStorage.getItem('cdk-product-list');
    if (productIdsStr) {
      this.product = JSON.parse(productIdsStr);
    }

    const categoryIdsStr = localStorage.getItem('cdk-category-list');
    if (categoryIdsStr) {
      this.category = JSON.parse(categoryIdsStr);
    }

    const userIdsStr = localStorage.getItem('cdk-user-list');
    if (userIdsStr) {
      this.user = JSON.parse(userIdsStr);
    }

    const thanaIdsStr = localStorage.getItem('cdk-thana-list');
    if (thanaIdsStr) {
      this.thana = JSON.parse(thanaIdsStr);
    }
    this.formInit();
  }

  formInit = () => {
    this.couponForm = new FormGroup({
      shopIDs: this.formBuilder.array([...this.shop]),
      productIDs: this.formBuilder.array([...this.product]),
      categorieIDs: this.formBuilder.array([...this.category]),
      thanasIDs: this.formBuilder.array([...this.thana]),
      userIDs: this.formBuilder.array([...this.user]),
      priority: new FormControl(1),
      couponCode: new FormControl(null, Validators.required),
      quantity: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.systemService.integerRegexp),
      ]),
      quantityPerUser: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.systemService.integerRegexp),
      ]),
      minimumAmount: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.systemService.numericRegexp),
      ]),
      reductionPercent: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.systemService.numericRegexp),
      ]),
      reductionAmount: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.systemService.numericRegexp),
      ]),
      description: new FormControl(null, Validators.required),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    });
  };

  hasError = (control: string, error: string) =>
    this.couponForm.controls[control].hasError(error);

  onStartDateChange(data: any) {
    this.minStartDate = data.value;
  }

  /****************** plus and minus *******************/
  inc = (field: string) => {
    const value = this.couponForm.controls[field].value as number;
    this.couponForm.controls[field].setValue(Number(value) + 1);
  };

  dec = (field: string) => {
    const value = this.couponForm.controls[field].value as number;
    if (value > 0) {
      this.couponForm.controls[field].setValue(Number(value) - 1);
    }
  };

  save = () => {
    console.log('couponForm', this.couponForm);

    if (this.couponForm.valid) {
      this.systemService.convertFormControlNumber([
        this.couponForm.controls.quantity,
        this.couponForm.controls.quantityPerUser,
        this.couponForm.controls.minimumAmount,
        this.couponForm.controls.reductionPercent,
        this.couponForm.controls.reductionAmount,
      ]);
      //console.log(this.couponForm);
      console.log(this.couponForm.value);
      const couponData = this.couponForm.value;
      this.couponService.create(couponData).subscribe((res) => {
        if (this.snackBarService.fire(res)) {
          this.couponForm.reset();
          this.router.navigate(['/dashboard/coupon/list']);
        }
      });
      localStorage.clear();
    }
  };

  resetForm = () => {
    this.couponForm.reset();
  };
}
