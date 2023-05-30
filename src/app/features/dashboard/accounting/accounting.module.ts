import { AccountingRoutingModule } from './accounting-routing.module';
import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminSalesComponent } from './sales-history/admin-sales/admin-sales.component';
import { MerchantSalesComponent } from './sales-history/merchant-sales/merchant-sales.component';
import { AccountingService } from './accounting.service';
import { MerchantInvoicesComponent } from './sales-history/invoices/merchant-invoices/merchant-invoices.component';
import { ShopSalesComponent } from './sales-history/shop-sales/shop-sales.component';
import { ShopInvoicesComponent } from './sales-history/invoices/shop-invoices/shop-invoices.component';
import { StatComponent } from './withdraw-history/stat/stat.component';
import { WithdrawService } from './withdraw.service';
import { ResponseService } from 'src/app/shared/services/response.service';
import { AddComponent } from './bank-details/add/add.component';
import { EditComponent } from './bank-details/edit/edit.component';
import { ListComponent } from './bank-details/list/list.component';
import { BankDetailResolveService } from './bank-details/resolvers/bank-detail-edit-resolve.service';
import { BankResolveService } from './bank-details/resolvers/bank-resolve.service';
import { BankListComponent } from './bank-details/bank-list/bank-list.component';
import { MerchantWithdrawalsComponent } from './withdraw-history/merchant-withdrawals/merchant-withdrawals.component';
import { WithdrawalRequestFormComponent } from './withdraw-history/withdrawal-request-form/withdrawal-request-form.component';
// import { WithdrawalRequestDetailsComponent } from './withdraw-history/withdrawal-request-details/withdrawal-request-details.component';

@NgModule({
  declarations: [
    AdminSalesComponent,
    MerchantSalesComponent,
    MerchantInvoicesComponent,
    ShopSalesComponent,
    ShopInvoicesComponent,
    StatComponent,
    AddComponent,
    EditComponent,
    ListComponent,
    BankListComponent,
    MerchantWithdrawalsComponent,
    WithdrawalRequestFormComponent,
    // WithdrawalRequestDetailsComponent,
  ],
  imports: [CommonModule, SharedModule, AccountingRoutingModule],
  providers: [
    AccountingService,
    WithdrawService,
    ResponseService,
    DatePipe,
    BankDetailResolveService,
    BankResolveService,
  ],
})
export class AccountingModule {}
