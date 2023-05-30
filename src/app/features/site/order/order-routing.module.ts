import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { OrderComponent } from './components/order/order.component';
import { OrderResolveService } from './resolvers/order-resolve.service';

const routes: Routes = [
  {
    path: ':id',
    component: OrderComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'User Order Payment',
    },
    resolve: {
      order: OrderResolveService,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {
}
