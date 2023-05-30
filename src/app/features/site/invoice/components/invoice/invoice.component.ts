import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MicroserviceURL } from '../../../../../core/enum/microservices.enum';
import { ApiConfigService } from '../../../../../core/services/api-config.service';
import { TokenStorageService } from '../../../../../core/services/token-storage.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  transMaster: any = {};
  companyInfo: any = {};

  paymentUrl = this.apiConfigService.getUrl(MicroserviceURL.PAYMENT);

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly activateRoute: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.transMaster = this.activateRoute.snapshot.data?.transMaster;
    this.companyInfo = this.tokenStorageService.getCompanyInfo();

    new Promise((resolve) => {
      // this.initSslCommerze();
      resolve(true);
    })
      .then(() => {})
      .catch(() => {});
  }

  initSslCommerze = () => {
    const sslBtn: any = document.getElementById('sslczPayBtn');
    sslBtn?.setAttribute('token', this.tokenStorageService.getToken());
    sslBtn?.setAttribute('order', this.transMaster?.id);
    sslBtn?.setAttribute('postdata', {});
    sslBtn?.setAttribute('endpoint', this.paymentUrl + 'ssl-commerze/prepare');
    const script: any = document.createElement('script');
    const tag = document.getElementsByTagName('script')[0];
    script.src =
      this.apiConfigService.getPaymentMerchantApi() +
      Math.random().toString(36).substring(7);
    tag.parentNode?.insertBefore(script, tag);
  };

  ifPublished = (): boolean => {
    if (
      this.transMaster?.invoice?.invoiceDetail?.job ||
      this.transMaster?.invoice?.invoiceDetail?.property
    ) {
      return !!(
        this.transMaster?.invoice?.invoiceDetail?.job?.isPublished ||
        this.transMaster?.invoice?.invoiceDetail?.property?.isPublished
      );
    }
    return false;
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
      console.log(canvas);
      const imgWidth = 220;

      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const heightLeft = imgHeight;
      console.log(imgWidth, imgHeight);

      const contentDataURL = canvas.toDataURL('image/png');
      console.log(contentDataURL);
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      const pdfName: string = this.transMaster?.invoice?.dateApplied;
      // @ts-ignore
      pdf.save(this.datePipe.transform(pdfName, 'YYYY-MM-dd'));
    });
  };
}
