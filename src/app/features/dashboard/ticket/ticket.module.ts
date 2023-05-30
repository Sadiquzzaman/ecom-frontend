import { DepartmentService } from './../department/department.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../app/shared/shared.module';
import { AddComponent } from './components/add/add.component';
import { TicketRoutingModule } from './ticket-routing.module';
import { ListComponent } from './components/list/list.component';
import { TicketService } from './ticket.service';
import { DepartmentResolveService } from './resolvers/department-resolve.service';

@NgModule({
  declarations: [AddComponent, ListComponent],
  imports: [CommonModule, SharedModule, TicketRoutingModule],
  providers: [TicketService, DepartmentService, DepartmentResolveService],
})
export class TicketModule {}
