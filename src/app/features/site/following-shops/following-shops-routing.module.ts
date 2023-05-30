import { FollowingShopsComponent } from './components/following-shops/following-shops.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FollowingShopsComponent,
    data: {
      title: 'Following Shops',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowingShopsRoutingModule {}
