import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImageType } from '../../../../../core/enum/image-type.enum';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ProductService } from '../../product.service';
import { FilterOption } from '../../../../../core/dto/filter-option.dto';

@Component({
  selector: 'app-category-profile',
  templateUrl: './category-profile.component.html',
  styleUrls: ['./category-profile.component.scss'],
})
export class CategoryProfileComponent implements OnInit {
  currentPage: number;
  limit: number;
  throttle: number;
  scrollDistance: number;
  isLoading: boolean;
  totalCount: number;

  category: any;
  navbar: any[];
  products: any[];

  filterOption: FilterOption;
  categoryImageType = ImageType.CATEGORY;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(({ matches }) => {
          if (matches) {
            return 3;
          }
          return 8;
        })
      )
      .subscribe((value) => {
        this.limit = value;
      });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.initValues();
      this.category = this.route.snapshot.data?.category;
      this.initNavbar();
      this.getProductsByCategory(this.filterOption);
    });
  }

  initValues = () => {
    this.currentPage = 0;
    this.limit = 8;
    this.throttle = 300;
    this.scrollDistance = 3;
    this.isLoading = true;
    this.totalCount = 0;
    this.category = {};
    this.navbar = [];
    this.products = [];
    this.filterOption = {
      search: '',
      price: '',
      rating: '',
      algorithm: 'latest',
    };
  };

  initNavbar = () => {
    console.log(this.category);
    if (this.category?.isRootCategory === 0) {
      this.navbar.push({
        name: this.category?.parent?.name,
        link: '/product/category/' + this.category?.parent?.id,
      });
    }
    this.navbar.push({
      name: this.category?.name,
      link: '',
    });

    console.log(this.navbar);
  };

  getProductsByCategory = (filter: FilterOption) => {
    this.isLoading = true;
    ++this.currentPage;
    this.productService
      .getByCategoryPagination(
        this.category.id,
        this.currentPage,
        this.limit,
        filter
      )
      .subscribe(
        (res) => {
          if (!res.error) {
            const products = res?.payload?.data?.products || [];
            this.totalCount = res?.payload?.data?.count || 0;
            this.products.push(...products);
            // ++this.currentPage;
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
        }
      );
  };

  onScrollDown = (ev: Event | EventTarget | any) => {
    if (this.currentPage != 0) this.getProductsByCategory(this.filterOption);
  };
}
