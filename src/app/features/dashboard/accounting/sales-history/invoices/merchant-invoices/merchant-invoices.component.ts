import { MicroserviceURL } from './../../../../../../core/enum/microservices.enum';
import { TokenStorageService } from './../../../../../../core/services/token-storage.service';
import { ApiConfigService } from './../../../../../../core/services/api-config.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { AccountingService } from '../../../accounting.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-merchant-invoices',
  templateUrl: './merchant-invoices.component.html',
  styleUrls: ['./merchant-invoices.component.scss'],
})
export class MerchantInvoicesComponent implements OnInit {
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

  //selectedPaymentMethod = 'Online Payment';
  //paymentMethods: string[] = ['Cash On Delivery', 'Online Payment'];
  // paymentUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);

  paymentMethod: any;
  isLoading: boolean = false;

  constructor(
    private accountingService: AccountingService,
    private readonly apiConfigService: ApiConfigService,
    private readonly activateRoute: ActivatedRoute,
    private readonly datePipe: DatePipe,
    private tokenStorageService: TokenStorageService // public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // console.log('aaa');
    this.isLoading = true;
    this.invoiceData();
    this.paymentMethod = this.accountingService.paymentMethod;
    // this.transMaster = this.activateRoute.snapshot.data?.invoice;
    // console.log('this.transMaster',this.activateRoute);
    // this.companyInfo = this.tokenStorageService.getCompanyInfo();
  }

  invoiceData = () => {
    this.activateRoute.params.subscribe((data) => {
      console.log(data.invoiceId);
      this.accountingService
        .findMerchantInvoiceByID(data.invoiceId)
        .subscribe((res) => {
          this.invoiceDetails = res?.payload?.data;
          console.log(this.invoiceDetails);
          for (const merchantInvoice of this.invoiceDetails
            .marchantInvoiceDetails) {
            this.subTotal =
              Number(this.subTotal) +
              Number(merchantInvoice.price * merchantInvoice.quantity);
          }
          this.isLoading = false;
        });
    });
  };

  productAttributeExtractor = (reference: any) => {
    let splittedParts = reference.split('-', 3);
    let productAttributes = splittedParts[1] + ', ' + splittedParts[2];
    return productAttributes;
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
      const imgWidth = 205;

      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const heightLeft = imgHeight;
      // console.log(imgWidth, imgHeight);

      const contentDataURL = canvas.toDataURL('image/png');
      // console.log(contentDataURL);
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      const pdfName: string = this.invoiceDetails?.createAt;
      // @ts-ignore
      pdf.save(this.datePipe.transform(pdfName, 'YYYY-MM-dd'));
    });
  };
}
