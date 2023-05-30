import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketDepartmentDto } from '../../../../../shared/dto/core/ticket-department.dto';
import { DepartmentService } from '../../department.service';
import { ResponseService } from '../../../../../shared/services/response.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  addDepartmentForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.formInit();
  }

  formInit = () => {
    this.addDepartmentForm = new FormGroup({
      name: new FormControl('', Validators.required),
    });
  };

  submitTicket() {
    if (!this.isSubmitted) {
      const departmentDto = this.addDepartmentForm.value as TicketDepartmentDto;
      this.departmentService
        .createDepartment(departmentDto)
        .subscribe((res) => {
          this.isSubmitted = false;
          if (this.snackBarService.fire(res)) {
            this.addDepartmentForm.reset();
            this.router.navigate(['/dashboard/department/list']);
          }
        });
    }
  }
}
