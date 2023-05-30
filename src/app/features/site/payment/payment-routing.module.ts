import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import {SuccessComponent} from './components/success/success.component';
import {FailComponent} from './components/fail/fail.component';
import {CancelComponent} from './components/cancel/cancel.component';

const routes: Routes = [
  {
    path: 'success',
    component: SuccessComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Payment Success',
    },
  },
  {
    path: 'fail',
    component: FailComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Payment Failed',
    },
  },
  {
    path: 'cancel',
    component: CancelComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Payment Canceled',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {
}
