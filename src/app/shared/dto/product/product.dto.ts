import { BaseDto } from '../core/base.dto';
import { ProductAttributeDto } from './product-attribute.dto';
import { ShopDto } from '../shop/shop.dto';
import { CategoryDto } from '../category/category.dto';
import { UserDto } from '../user/user.dto';
import { CartDto } from '../cart/cart.dto';
import { ProductImageDto } from './product-image.dto';
import { Bool } from '../../enum/bool.enum';

export class ProductDto extends BaseDto {
  name: string;

  description: string;

  summary: string;

  location: string;

  metaDescription: string;

  metaKeywords: string;

  rating: number;

  metaTitle: string;

  reference: string;

  quantity: number;

  lowStockThreshold: number;

  price: number;

  discount: number;

  wholesalePrice: number;

  additionalShippingCost: number;

  image: ProductImageDto;

  onSale: Bool;

  isVirtual: Bool;

  isPack: Bool;

  productAttributes: ProductAttributeDto[];

  shop: ShopDto;

  category: CategoryDto;

  user: UserDto;

  cartItems: CartDto[];
}
