import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { TransporterRefundService } from '../../transporter-refund.service';

@Component({
  selector: 'app-refund-invoice',
  templateUrl: './refund-invoice.component.html',
  styleUrls: ['./refund-invoice.component.scss'],
})
export class RefundInvoiceComponent implements OnInit {
  currentId: string;
  refundData: any;
  subTotal: number = 0;
  refundDetails: any[];
  paymentMethod: any;
  isLoading: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly transporterRefundService: TransporterRefundService,
    public datePipe: DatePipe,
    private router: Router,
    private readonly token: TokenStorageService
  ) {}

  ngOnInit(): void {
    if (this.token.isCustomer()) {
      this.router.navigate([this.token.DASHBOARD]);
    }
    this.isLoading = true;
    this.showRefundDetails();
  }

  productAttributeExtractor = (reference: any) => {
    let splittedParts = reference.split('-', 3);
    let productAttributes = splittedParts[1] + ', ' + splittedParts[2];
    return productAttributes;
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
      const pdfName: string = this.refundData?.createAt;
      // @ts-ignore
      pdf.save(this.datePipe.transform(pdfName, 'YYYY-MM-dd'));
    });
  };

  showRefundDetails = () => {
    this.activatedRoute.params.subscribe((data) => {
      this.transporterRefundService
        .findByID(data.id, '1')
        .subscribe((res: any) => {
          this.refundData = res?.payload?.data;

          this.refundDetails = this.refundData.refundRequestDetails;
          console.log(this.refundData);
          this.isLoading = false;
        });
    });
  };
}
