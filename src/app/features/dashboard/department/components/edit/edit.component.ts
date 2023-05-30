import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ResponseService } from 'src/app/shared/services/response.service';
import { DepartmentService } from '../../department.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  editDepartmentForm!: FormGroup;
  isLoading = false;
  isSubmitted = false;
  btnLabel = 'Update';
  id = '';

  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly snackBarService: ResponseService,
    private route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.formInit(this.route.snapshot.data?.department);
  }

  formInit = (department: any) => {
    this.id = department?.id;
    this.editDepartmentForm = new FormGroup({
      name: new FormControl(department?.name, Validators.required),
    });
  };

  save = () => {
    if (this.editDepartmentForm.valid) {
      this.submit();
    }
  };

  submit = () => {
    this.isLoading = true;
    this.departmentService
      .update(this.id, this.editDepartmentForm.value)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          this.editDepartmentForm.reset();
          this.router.navigate(['/dashboard/department/list']);
        } else {
          this.btnLabel = 'Try Again!';
        }
      });
  };
}
