import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../../../core/services/api-config.service';
import { MicroserviceURL } from '../../../core/enum/microservices.enum';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class PromotionService {
  baseUrl =
    this.apiConfigService.getUrl(MicroserviceURL.CATELOG) + `promotions`;
  catelogBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG);
  imageUrl =
    this.apiConfigService.getUrl(MicroserviceURL.IMAGE) + `image-upload`;
  shopBaseUrl = this.apiConfigService.getUrl(MicroserviceURL.CATELOG);

  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private readonly _httpClient: HttpClient,
    private apiConfigService: ApiConfigService
  ) {}

  pagination = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    isAdmin: boolean = false,
    merchantId: string = '',
    shopId: string = '',
    productId: string = '',
    promotionType: string = '',
    promotionStatus: string = '',
    fromDate: string = '',
    toDate: string = ''
  ): Observable<any> => {
    if (isAdmin)
      return this._httpClient.get(
        `${this.baseUrl}/admin/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&merchantId=${merchantId}&shopId=${shopId}&productId=${productId}&promotionType=${promotionType}&promotionStatus=${promotionStatus}&fromDate=${fromDate}&toDate=${toDate}`
      );
    else
      return this._httpClient.get(
        `${this.baseUrl}/merchant/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}&merchantId=${merchantId}&shopId=${shopId}&productId=${productId}&promotionType=${promotionType}&promotionStatus=${promotionStatus}&fromDate=${fromDate}&toDate=${toDate}`
      );
  };

  slotPagination = (
    page: number,
    limit: number,
    sort: string,
    order: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.catelogBaseUrl}promotions-slot/pagination?page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    );

  paginationByApprovalStatus = (
    page: number,
    limit: number,
    sort: string,
    order: string,
    isApproved: string
  ): Observable<any> =>
    this._httpClient.get(
      `${this.baseUrl}/promotions-by-approval-status?page=${page}&limit=${limit}&sort=${sort}&order=${order}&isApproved=${isApproved}`
    );

  bookingSlots = (
    promotionType: number = 1,
    shopId: string = '',
    productId: string = ''
  ): Observable<any> =>
    this._httpClient
      .get(
        `${this.catelogBaseUrl}promotions/booking/slots?promotionType=${promotionType}&shopId=${shopId}&productId=${productId}`
      )
      .pipe(map((res: any) => res.payload.data));

  slotCost = (
    promotionType: number = 1,
    shopId: string = '',
    productId: string = '',
    startDate: string = '',
    endDate: string = ''
  ): Observable<any> =>
    this._httpClient
      .get(
        `${this.catelogBaseUrl}promotions/booking/costs?promotionType=${promotionType}&shopId=${shopId}&productId=${productId}&startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(map((res: any) => res.payload.data));

  create = (dto: any): Observable<any> =>
    this._httpClient.post(`${this.baseUrl}`, dto);

  update = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/${id}`, dto);

  uploadCoverImage = (filename: string, type: number) =>
    this._httpClient.post(`${this.imageUrl}/promotion/cover`, {
      filename,
      type,
    });

  uploadCoverImageRedis = (image: File): Observable<any> => {
    const formData = new FormData();
    formData.append('image', image);
    return this._httpClient.post(
      `${this.imageUrl}/promotion-redis/cover`,
      formData
    );
  };

  findByID = (id: string): Observable<any> =>
    this._httpClient.get(`${this.baseUrl}/${id}`);

  remove = (id: string | null): Observable<any> =>
    this._httpClient.delete(`${this.baseUrl}/${id}`);

  updateApprovalStatus = (dto: any): Observable<any> =>
    this._httpClient.put(`${this.baseUrl}/promotion-approval`, dto);

  getShopByMerchantId = (id: string): Observable<any> => {
    return this._httpClient
      .get(`${this.shopBaseUrl}admin/shops/promotion-shop${id}`)
      .pipe(
        map((res: any) => res?.payload?.data || {}),
        map((shops: any[]) =>
          shops.map((shop: any) => ({
            id: shop.id,
            name: shop.name,
            // typeId: shop.shopType?.id,
            // type: shop.shopType?.name,
          }))
        )
      );
  };

  getShopByShopId = (id: string): Observable<any> => {
    return this._httpClient.get(`${this.shopBaseUrl}admin/shops/${id}`).pipe(
      map((res: any) => res?.payload?.data || {})
      // map((shops: any[]) =>
      //   shops.map((shop: any) => ({
      //     id: shop.id,
      //     name: shop.name,
      //     // typeId: shop.shopType?.id,
      //     // type: shop.shopType?.name,
      //   }))
      // )
    );
  };

  getProductsByShopId = (
    id: string,
    page: number = 1,
    limit: number = 1000
  ): any => {
    // console.log(id);
    return this._httpClient
      .get(
        `${this.catelogBaseUrl}merchant/products/find/shop?id=${id}&page=${page}&limit=${limit}`
      )
      .pipe(
        map((res: any) => res?.page?.data || {}),
        // tap((products: any) => console.log(products)),
        map((products: any[]) =>
          products.map((product: any) => ({
            id: product.id,
            name: product.name,
            // categoryId: product.category?.id,
            // category: product.category?.name,
          }))
        )
      );
  };

  updatePromotionSlot = (id: string, dto: any): Observable<any> =>
    this._httpClient.put(`${this.catelogBaseUrl}promotions-slot/${id}`, dto);
}
