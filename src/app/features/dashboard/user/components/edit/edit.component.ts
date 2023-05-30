import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../../../core/services/users.service';
import { ResponseService } from '../../../../../shared/services/response.service';

interface Gender {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  userForm!: FormGroup;
  isLoading = false;
  isFetching = true;
  userId: string | null = null;
  genders: Gender[] = [
    { value: 1, viewValue: 'Male' },
    { value: 2, viewValue: 'Female' },
    { value: 3, viewValue: 'Unknown' },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UsersService,
    private readonly rS: ResponseService,
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.userId = param.get('id');
      this.userService.findOne(this.userId).subscribe((res) => {
        const data = res.payload.data;
        this.userForm = new FormGroup({
          firstName: new FormControl(data.firstName, [
            Validators.required,
            Validators.maxLength(100),
          ]),
          lastName: new FormControl(data.lastName, [
            Validators.required,
            Validators.maxLength(100),
          ]),
          email: new FormControl(data.email, [Validators.required]),
          phone: new FormControl(data.phone, [Validators.required]),
          gender: new FormControl(data.gender, [Validators.required]),
        });
        this.isFetching = false;
      });
    });
  }

  hasError = (control: string, error: string) =>
    this.userForm.controls[control].hasError(error);

  update = () => {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.userService
        .update(this.userId, this.userForm.value)
        .subscribe((res: any) => {
          this.isLoading = false;
          this.rS.fire(res);
          this._location.back();
        });
    }
  };
}
