import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';
import { LayoutComponent } from '../../blocks/layout/dashboard-layout/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
        data: {
          title: 'User',
        },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        data: {
          title: 'Profile',
        },
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule),
        data: {
          title: 'Category',
        },
      },
      {
        path: 'shop',
        loadChildren: () =>
          import('./shop/shop.module').then((m) => m.ShopModule),
        data: {
          title: 'Shop',
        },
      },
      {
        path: 'shop-type',
        loadChildren: () =>
          import('./shop-type/shop-type.module').then((m) => m.ShopTypeModule),
        data: {
          title: 'Shop Type',
          permissions: ['admin'],
        },
        canActivate: [PermissionGuard],
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./product/product.module').then((m) => m.ProductModule),
        data: {
          title: 'Product',
        },
      },
      {
        path: 'stock',
        loadChildren: () =>
          import('./stock/stock.module').then((m) => m.StockModule),
        data: {
          title: 'Stock',
        },
      },
      {
        path: 'order',
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderModule),
        data: {
          title: 'order',
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'ticket',
        loadChildren: () =>
          import('./ticket/ticket.module').then((m) => m.TicketModule),
        data: {
          title: 'ticket',
        },
      },
      {
        path: 'coupon',
        loadChildren: () =>
          import('./coupon/coupon.module').then((m) => m.CouponModule),
        data: {
          title: 'coupon',
        },
      },
      {
        path: 'contact-us',
        loadChildren: () =>
          import('./contactUS/contact-us.module').then(
            (m) => m.ContactUsModule
          ),
        data: {
          title: 'Contact Us',
        },
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'department',
        loadChildren: () =>
          import('./department/department.module').then(
            (m) => m.DepartmentModule
          ),
      },
      {
        path: 'promotion',
        loadChildren: () =>
          import('./promotion/promotion.module').then((m) => m.PromotionModule),
      },
      {
        path: 'configuration',
        loadChildren: () =>
          import('./configuration/configuration.module').then(
            (m) => m.ConfigurationModule
          ),
      },
      {
        canActivate: [PermissionGuard],
        path: 'static-page',
        loadChildren: () =>
          import('./static-page/static-page.module').then(
            (m) => m.StaticPageModule
          ),
        data: {
          title: 'Static Pages',
          permissions: ['admin'],
        },
      },
      {
        path: 'onlinePaymentInfo',
        loadChildren: () =>
          import('./online-payment-info/online-payment-info.module').then(
            (m) => m.OnlinePaymentInfoModule
          ),
      },
      {
        path: 'product-attribute',
        loadChildren: () =>
          import('./product-attribute/attributes/attribute.module').then(
            (m) => m.AttributeModule
          ),
      },
      {
        path: 'product-attribute-group',
        loadChildren: () =>
          import(
            './product-attribute/attribute-group/attribute-group.module'
          ).then((m) => m.AttributeGroupModule),
      },
      {
        path: 'accounting',
        loadChildren: () =>
          import('./accounting/accounting.module').then(
            (m) => m.AccountingModule
          ),
      },
      {
        path: 'shipment',
        loadChildren: () =>
          import('./shipment/shipment.module').then((m) => m.ShipmentModule),
      },
      {
        path: 'shipping-details',
        loadChildren: () =>
          import('./shipping-details/shipping-details.module').then(
            (m) => m.ShippingDetailsModule
          ),
      },
      {
        path: 'transporter-details',
        loadChildren: () =>
          import('./transporter-details/transporter-details.module').then(
            (m) => m.TransporterDetailsModule
          ),
      },
      {
        path: 'refund-config',
        loadChildren: () =>
          import('./refund-config/refund-config.module').then(
            (m) => m.RefundConfigModule
          ),
      },

      {
        path: 'refund',
        loadChildren: () =>
          import('./refund/refund.module').then((m) => m.RefundModule),
      },
      {
        path: 'transporter-refund',
        loadChildren: () =>
          import('./transporter-refund/transporter-refund.module').then(
            (m) => m.TransporterRefundModule
          ),
      },
      {
        path: 'return',
        loadChildren: () =>
          import('./return/return.module').then((m) => m.ReturnModule),
      },
      {
        path: 'add-user',
        loadChildren: () =>
          import('./add-user/add-user.module').then((m) => m.AddUserModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
