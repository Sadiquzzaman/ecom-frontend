import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, tap } from 'rxjs/operators';
import { ImageType } from 'src/app/core/enum/image-type.enum';
import { ResponseService } from 'src/app/shared/services/response.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { OrderService } from './../../order.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss'],
})
export class ReturnComponent implements OnInit {
  displayedColumns: string[] = [
    'checkbox',
    'product',
    'quantity',
    'return_quantity',
    'reason',
  ];
  dataSource: any = new MatTableDataSource();
  data: any = [];
  reasons: any[];
  orderID: string;
  refundForm!: FormGroup;
  agreeCheck = new FormControl('', Validators.required);

  selection = new SelectionModel<any>(true, []);
  isLoading: boolean;
  imageType = ImageType.PRODUCT_SMALL;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly orderService: OrderService,
    private readonly snackBarService: ResponseService,
    private readonly systemService: SystemService,
    private formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.activatedRoute.params
      .pipe(
        tap((id) => {
          this.orderID = id.orderId;
        }),
        concatMap(() => {
          return this.orderService.findShopInvoiceByID(this.orderID);
        })
      )
      .subscribe((res) => {
        this.data = res?.payload?.data;
        this.isLoading = false;
        this.dataSource = this.data.map((ele: any) => {
          ele.shopInvoiceDetails['refund_quantity'] = 0;
          ele.shopInvoiceDetails['refund_reason'] = '';
          return ele;
        });
      });

    this.getReasons();
    this.initForm();
  }

  changeQuantity = ($event: any, row: any) => {
    let value = $event.value;
    row['refund_quantity'] = value;
    let id = row['id'];
    this.dataSource.map((ele: any) => {
      if (ele.shopInvoiceDetails.id == id) {
        ele.shopInvoiceDetails['refund_quantity'] = value;
      }
      return ele;
    });
  };

  changeReason = ($event: any, row: any) => {
    let value = $event.value;
    row['refund_reason'] = value;
    let id = row['id'];
    this.dataSource.map((ele: any) => {
      if (ele.shopInvoiceDetails.id == id) {
        ele.shopInvoiceDetails['refund_reason'] = value;
      }
      return ele;
    });
  };

  getProductRefundReason(
    productId: '',
    productAttributeId: '',
    shopInvoiceDetailID: '',
    quantity: number,
    refundReason: ''
  ) {
    let productRefundReasons = this.refundForm.get(
      'productRefundReason'
    ) as FormArray;

    productRefundReasons.push(
      this.formBuilder.group({
        productID: [productId, Validators.required],
        productAttributeID: [productAttributeId, Validators.required],
        shopInvoiceDetailID: [shopInvoiceDetailID, Validators.required],
        quantity: quantity,
        refundReason: [refundReason, Validators.required],
      })
    );
  }

  initForm = () => {
    this.refundForm = this.formBuilder.group({
      orderID: [this.orderID, Validators.required],
      additionalInformation: ['', Validators.required],
      agreeCheck: ['', Validators.requiredTrue],
      productRefundReason: this.formBuilder.array([]),
    });
  };

  productAttributeExtractor = (reference: any) => {
    return this.systemService.attributeExtractor(reference);
  };

  getReasons = () => {
    this.orderService.getAllReasons().subscribe((res) => {
      this.reasons = res.payload.data;
    });
  };

  logSelection() {
    this.isLoading = true;
    if (!this.selection.selected.length) {
      this.snackBarService.message('Select at least one item first !!!');
      this.isLoading = false;
      return;
    }
    if (!this.refundForm.valid) {
      this.snackBarService.message('Fill all the required fields !!!');
      this.isLoading = false;
      return;
    }

    (<FormArray>this.refundForm.get('productRefundReason')).clear();

    let invalid = false;

    this.selection.selected.forEach((data) => {
      if (
        !data.hasOwnProperty('refund_quantity') ||
        data['refund_quantity'] == 0
      ) {
        // console.log(data);
        invalid = true;
        this.snackBarService.message(
          'Select Refund Quantity for all selected items !!!'
        );
        this.isLoading = false;
        return;
      }

      if (
        !data.hasOwnProperty('refund_reason') ||
        data['refund_reason'] == ''
      ) {
        // console.log(data);
        invalid = true;
        this.snackBarService.message(
          'Select Refund Reason for all selected items !!!'
        );
        this.isLoading = false;
        return;
      }

      console.log(data);

      this.getProductRefundReason(
        data.product.id,
        data.productAttribute.id,
        data.id,
        data.refund_quantity,
        data.refund_reason
      );
    });

    if (invalid) {
      this.isLoading = false;
      return;
    }

    // console.log(this.refundForm.value);
    // const { agreeCheck, ...formData } = this.refundForm.value;
    let formData: any = { ...this.refundForm.value };
    console.log(this.refundForm.value);

    delete formData['agreeCheck'];
    // console.log(formData);

    this.orderService.createRefundRequest(formData).subscribe((res) => {
      this.isLoading = false;
      if (this.snackBarService.fire(res)) {
        this.refundForm.reset();
        // this.router.navigate(['/dashboard/order/details/', this.orderID]);
        this.router.navigate(['/dashboard/order']);
      }
    });
  }
}
