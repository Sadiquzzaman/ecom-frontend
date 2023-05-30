import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {debounceTime, delay, filter, map, takeUntil, tap} from 'rxjs/operators';

import {RoleService} from '../../../../../core/services/role.service';
import {UsersService} from '../../../../../core/services/users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ResponseService} from '../../../../../shared/services/response.service';

interface Role {
  id: string;
  role: string;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit, OnDestroy {
  addRoleForm!: FormGroup;
  isLoading = false;
  isFetching = true;
  isSearching = false;
  btnLabel = 'Save';
  id = '';
  role: Role[] = [];
  roleFiltering: FormControl = new FormControl();
  filteredRoleOptions: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();

  constructor(
    private readonly roleService: RoleService,
    private readonly snackBarService: ResponseService,
    private readonly userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.findParamId();
    this.findAllRole();
    this.formInitiate();
    this.filterRole();
  }

  findParamId = () => {
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });
  };

  findAllRole = () => {
    this.roleService.findAll().subscribe((res) => {
      this.role = res.payload.data;
      this.filteredRoleOptions.next(this.role);
      this.isFetching = false;
    });
  };

  formInitiate = () => {
    this.addRoleForm = new FormGroup({
      roleId: new FormControl(null, [Validators.required]),
    });
  };

  filterRole = () => {
    this.roleFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.role) {
            return [];
          }
          return this.role.filter((role) => role.role.indexOf(search) > -1);
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filteredBanks) => {
          this.isSearching = false;
          this.filteredRoleOptions.next(filteredBanks);
        },
        () => {
          this.isSearching = false;
        }
      );
  };

  hasError = (control: string, error: string) => this.addRoleForm.controls[control].hasError(error);

  save = (id: string) => {
    if (this.addRoleForm.valid) {
      this.isLoading = true;
      this.userService
        .addRole(id, this.addRoleForm.value)
        .subscribe((response: any) => {
          this.isLoading = false;
          if (this.snackBarService.fire(response)) {
            this.addRoleForm.reset();
            this.router.navigate(['/dashboard/user']);
          } else {
            this.btnLabel = 'Try Again!';
          }
        });
    }
  };

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
