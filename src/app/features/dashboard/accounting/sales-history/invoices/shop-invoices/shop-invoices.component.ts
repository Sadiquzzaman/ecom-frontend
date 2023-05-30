import { AccountingService } from './../../../accounting.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-shop-invoices',
  templateUrl: './shop-invoices.component.html',
  styleUrls: ['./shop-invoices.component.scss'],
})
export class ShopInvoicesComponent implements OnInit {
  currentId: string;
  shopInvoiceData: any;
  subTotal: number = 0;
  invoiceDetails: any[];
  paymentMethod: any;
  isLoading: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly accountingService: AccountingService,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.showShopInvoice();
    this.paymentMethod = this.accountingService.paymentMethod;
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
      const pdfName: string = this.shopInvoiceData?.createAt;
      // @ts-ignore
      pdf.save(this.datePipe.transform(pdfName, 'YYYY-MM-dd'));
    });
  };

  showShopInvoice = () => {
    this.activatedRoute.params.subscribe((data) => {
      this.accountingService
        .findShopInvoiceByID(data.id)
        .subscribe((res: any) => {
          this.shopInvoiceData = res?.payload?.data;

          this.invoiceDetails = this.shopInvoiceData.shopInvoiceDetails;
          for (const shopInvoice of this.shopInvoiceData.shopInvoiceDetails) {
            this.subTotal =
              Number(this.subTotal) +
              Number(shopInvoice.price * shopInvoice.quantity);
          }
          console.log(this.shopInvoiceData);
          this.isLoading = false;
        });
    });
  };
}
