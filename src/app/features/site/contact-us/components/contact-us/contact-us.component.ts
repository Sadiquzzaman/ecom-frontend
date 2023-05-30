import { ResponseService } from '../../../../../shared/services/response.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ContactUsService } from '../../contact-us.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contactUsForm: FormGroup;

  constructor(
    private readonly contactUsService: ContactUsService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.contactUsForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [Validators.required]),
      subject: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
    });
  };

  submit = () => {
    const contactUsData = this.contactUsForm.value;
    if (this.contactUsForm.valid) {
      this.contactUsService.createContactUs(contactUsData).subscribe((res) => {
        if (this.snackBarService.fire(res)) {
          this.contactUsForm.reset();
          this.router.navigate(['/']);
          // this.router.navigate(['/dashboard/contact-us']);
        }
      });
    }
  };

  clearForm = () => {
    this.contactUsForm.reset();
  };
}
