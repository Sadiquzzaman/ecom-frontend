import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../app/shared/shared.module';
import { ListComponent } from './components/list/list.component';
import { ThanaResolveService } from './resolvers/thana-resolve.service';
import { StockRoutingModule } from './stock-routing.module';
import { StockService } from './stock.service';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, SharedModule, StockRoutingModule],
  providers: [StockService, ThanaResolveService],
})
export class StockModule {}
