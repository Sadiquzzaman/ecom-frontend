import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ResponseService } from '../../../../../shared/services/response.service';
import { CreateTicketDto } from '../../../../../shared/dto/core/create/create-ticket.dto';
import { TicketDepartmentDto } from '../../../../../shared/dto/core/ticket-department.dto';
import { TicketService } from '../../ticket.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit, OnDestroy {
  ticketForm!: FormGroup;
  departmentList!: TicketDepartmentDto;
  protected _onDestroy = new Subject<void>();

  departmentID = null;
  isDepartmentSearching = false;
  departmentFiltering: FormControl = new FormControl();
  departmentOptions: Array<{ id: string; name: string }> = [];
  filteredDepartmentOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  constructor(
    private readonly ticketService: TicketService,
    private route: ActivatedRoute,
    private readonly snackBarService: ResponseService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.initTicketForm();
    const departments = this.route.snapshot.data?.departments;
    const allDepartments = departments.map((department: any) => ({
      id: department.id,
      name: department.name,
    }));
    if (allDepartments?.length > 0) {
      this.departmentOptions = allDepartments;
    } else {
      this.departmentOptions = [];
    }

    this.filteredDepartmentOptions.next(this.departmentOptions);
    this.fetchAllDepartments();
  }

  ngOnDestroy(): void {
    this._onDestroy.unsubscribe;
  }

  initTicketForm() {
    this.ticketForm = new FormGroup({
      departmentId: new FormControl(null, [Validators.required]),
      subject: new FormControl(null, [Validators.required]),
      issueDetails: new FormControl(null, [Validators.required]),
    });
  }

  fetchAllDepartments = () => {
    this.departmentFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isDepartmentSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.departmentOptions) {
            return [];
          }
          return this.departmentOptions.filter(
            (merchant) =>
              merchant.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isDepartmentSearching = false;
          this.filteredDepartmentOptions.next(filtered);
        },
        () => {
          this.isDepartmentSearching = false;
        }
      );
  };

  submitTicket = () => {
    if (this.ticketForm.valid) {
      const ticketDto = this.ticketForm.value as CreateTicketDto;
      this.ticketService.create(ticketDto).subscribe((res) => {
        if (this.snackBarService.fire(res)) {
          this.ticketForm.reset();
          this.router.navigate(['/dashboard/ticket/list']);
        }
      });
    }
  }

  clearForm = () => {
    this.ticketForm.reset();
  };
}
