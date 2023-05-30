import {BaseDto} from '../../core/base.dto';
import {ProductDto} from '../../product/product.dto';
import {ProductAttributeDto} from '../../product/product-attribute.dto';
import {InvoiceDto} from './invoice.dto';

export class InvoiceDetailsDto extends BaseDto {
  additional: string;

  note: string;

  quantity: number;

  product: ProductDto;

  productAttribute: ProductAttributeDto;

  invoice: InvoiceDto;
}
