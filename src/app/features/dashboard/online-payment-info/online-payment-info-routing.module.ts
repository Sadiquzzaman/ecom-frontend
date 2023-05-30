import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGuard } from 'src/app/shared/guards/permission.guard';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  {
    canActivate: [PermissionGuard],
    path: 'list',
    component: ListComponent,
    data: { title: 'Online Payment Info', permissions: ['admin'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlinePaymentInfoRoutingModule {}
