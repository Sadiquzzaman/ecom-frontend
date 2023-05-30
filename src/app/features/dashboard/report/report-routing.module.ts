import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './component/report/report.component';


const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    data: { title: 'Report' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {}
