import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { DepartmentRoutingModule } from './department-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { DepartmentService } from './department.service';
import { EditComponent } from './components/edit/edit.component';
import { DepartmentEditResolveService } from './resolvers/department-edit-resolve.service';

@NgModule({
  declarations: [AddComponent, ListComponent, EditComponent],
  imports: [CommonModule, DepartmentRoutingModule, SharedModule],
  providers: [DepartmentService, DepartmentEditResolveService],
})
export class DepartmentModule {}
