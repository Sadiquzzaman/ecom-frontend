import { DeliveredListComponent } from './components/delivered-list/delivered-list.component';
import { PickedListComponent } from './components/picked-list/picked-list.component';
import { AssignedListComponent } from './components/assigned-list/assigned-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'assigned-list',
    component: AssignedListComponent,
    data: { title: 'Assigned-list' },
  },
  {
    path: 'picked-list',
    component: PickedListComponent,
    data: { title: 'Picked-list' },
  },
  {
    path: 'delivered-list',
    component: DeliveredListComponent,
    data: { title: 'Delivered-list' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransporterDetailsRoutingModule {}
