import {InvoiceDto} from '../invoice.dto';
import {InvoiceDetailsDto} from '../invoice-details.dto';
import {OrderDto} from '../../../order/order.dto';

export class CreateInvoiceDto {
  invoice: InvoiceDto;

  order: OrderDto;

  invoiceDetail: InvoiceDetailsDto;
}
