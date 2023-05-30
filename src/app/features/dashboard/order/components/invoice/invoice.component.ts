import { MicroserviceURL } from './../../../../../core/enum/microservices.enum';
import { TokenStorageService } from './../../../../../core/services/token-storage.service';
import { ApiConfigService } from './../../../../../core/services/api-config.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { OrderService } from '../../order.service';
import { ResponseService } from 'src/app/shared/services/response.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/features/dashboard/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  invoiceDetails: any;
  productDetails: any;
  subTotal: number = 0;
  totalVat = 0;
  totalDiscount = 0;
  shippingCharge = 40;
  totalAdditionalShippingCharge = 0;
  grandTotal = 0;
  cupon: any;
  reductionPercent: any;
  totalAmount: any;
  cuponValue: any;
  cuponValueStr: string;
  orderDetails: any[];
  transMaster: any = {};
  companyInfo: any = {};

  selectedPaymentMethod = 'Online Payment';
  paymentMethods: string[] = ['Cash on Delivery', 'Online Payment'];
  paymentUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);

  isLoading: boolean = false;

  dialogRef!: MatDialogRef<ConfirmDialogComponent> | null;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly activateRoute: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    public datePipe: DatePipe,
    private readonly orderService: OrderService,
    private readonly rS: ResponseService,
    private readonly matDialog: MatDialog
  ) {}

  paymentMethod: any;

  ngOnInit(): void {
    this.isLoading = true;
    this.invoiceData();
    // this.transMaster = this.activateRoute.snapshot.data?.invoice;
    // console.log('this.transMaster',this.activateRoute);
    this.companyInfo = this.tokenStorageService.getCompanyInfo();

    this.paymentMethod = this.orderService.paymentMethod;
  }

  productAttributeExtractor = (reference: any) => {
    let splittedParts = reference.split('-', 3);
    let productAttributes = splittedParts[1] + ', ' + splittedParts[2];
    return productAttributes;
  };

  initSslCommerze = (invoiceDetails: any) => {
    const sslBtn: any = document.getElementById('sslczPayBtn');
    sslBtn?.setAttribute('token', this.tokenStorageService.getToken());
    sslBtn?.setAttribute('order', invoiceDetails.transMaster.id);
    sslBtn?.setAttribute('postdata', {});
    sslBtn?.setAttribute('endpoint', this.paymentUrl + 'ssl-commerze/prepare');
    const script: any = document.createElement('script');
    const tag = document.getElementsByTagName('script')[0];
    script.src =
      this.apiConfigService.getPaymentMerchantApi() +
      Math.random().toString(36).substring(7);
    tag.parentNode?.insertBefore(script, tag);
  };

  ifOrdered = (): boolean => {
    if (this.invoiceDetails?.paymentMethod === 0) {
      return false;
    }
    return true;
  };

  getDescription = (): string => {
    if (this.transMaster?.invoice?.invoiceDetail?.job) {
      return this.transMaster?.invoice?.invoiceDetail?.job.designation;
    } else {
      return this.transMaster?.invoice?.invoiceDetail?.property.title;
    }
  };

  public convertToPDF = () => {
    const data: any = document.getElementById('contentToConvert');
    html2canvas(data, {
      scrollY: -window.scrollY,
      scale: 1,
    }).then((canvas) => {
      // Few necessary setting options
      // console.log(canvas);
      const imgWidth = 220;

      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const heightLeft = imgHeight;
      // console.log(imgWidth, imgHeight);

      const contentDataURL = canvas.toDataURL('image/png');
      // console.log(contentDataURL);
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      const pdfName: string = this.transMaster?.invoice?.dateApplied;
      // @ts-ignore
      pdf.save(this.datePipe.transform(pdfName, 'YYYY-MM-dd'));
    });
  };

  invoiceData = () => {
    this.activateRoute.params.subscribe((data) => {
      this.orderService.findInvoiceByByID(data.invoiceId).subscribe((res) => {
        this.invoiceDetails = res?.payload?.data;
        for (const invoicedetail of this.invoiceDetails.invoiceDetails) {
          this.subTotal =
            Number(this.subTotal) +
            Number(invoicedetail.quantity * invoicedetail.price);
        }
        console.log(this.invoiceDetails);
        this.isLoading = false;
      });
    });
  };

  changeStatus(status: number) {
    this.dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure to place order?',
        message: 'This can`t be undone',
      },
    });

    this.dialogRef.afterClosed().subscribe((yes) => {
      if (yes) {
        const statusDto = { status };
        this.orderService
          .changeStatusByID(this.invoiceDetails?.order?.id, statusDto)
          .subscribe((res) => {
            if (res?.payload?.data?.status == 2) {
              this.rS.message(
                'Your order has been placed! Wait for admin to confirm',
                false
              );
            }
            console.log(status);
            console.log(res);
          });
      }
      this.dialogRef = null;
    });
  }

  // invoiceData = () => {
  //   this.activateRoute.params.subscribe((data) => {
  //     this.orderService.findInvoiceByByID(data?.orderId).subscribe((res) => {
  //       this.invoiceDetails = res?.payload?.data;
  //       this.cupon = this.invoiceDetails.coupon;
  //       this.orderDetails = this.invoiceDetails.orderDetails;
  //       console.log('invoiceDetails',this.invoiceDetails);
  //       this.transMaster = this.invoiceDetails.transMaster;
  //       new Promise((resolve) => {
  //         this.initSslCommerze(this.invoiceDetails);
  //         resolve(true);
  //       })
  //         .then(() => {})
  //         .catch(() => {});
  //       for (const total of this.orderDetails) {
  //         this.subTotal = this.subTotal + total.price * total.quantity;
  //         this.totalDiscount =
  //           this.totalDiscount + total.quantity * total.productAttribute.discount;
  //         this.totalAdditionalShippingCharge =
  //           this.totalAdditionalShippingCharge +
  //           total.productAttribute.additionalShippingCost;
  //       }
  //       this.totalAmount=this.subTotal +
  //       this.totalAdditionalShippingCharge +
  //       this.shippingCharge +
  //       this.totalVat -
  //       this.totalDiscount;

  //       this.grandTotal =
  //         this.subTotal +
  //         this.totalAdditionalShippingCharge +
  //         this.shippingCharge +
  //         this.totalVat -
  //         this.totalDiscount;

  //       this.cuponValue = 0.0;
  //       this.cuponValueStr = '';

  //       if(this.cupon ){
  //         if(parseFloat(`${this.cupon.reductionPercent}`) > 0){
  //           this.reductionPercent = parseFloat(`${this.cupon.reductionPercent}`)
  //           this.cuponValue = ((parseFloat(`${this.cupon.reductionPercent}`) / 100.00) * parseFloat(`${this.grandTotal}`));
  //           this.cuponValueStr = `${this.cupon.reductionPercent} %`;
  //         } else{
  //           this.cuponValue = parseFloat(`${this.cupon.reductionAmount}`);
  //           this.cuponValueStr = `${this.cupon.reductionAmount} Tk`;
  //         }
  //       }
  //         this.grandTotal = parseFloat(`${this.grandTotal}`) -  parseFloat(`${this.cuponValue}`)
  //     });
  //   });
  // };
}
