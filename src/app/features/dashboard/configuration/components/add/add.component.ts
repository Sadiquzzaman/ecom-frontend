import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../configuration.service';
import { Router } from '@angular/router';
import { ResponseService } from '../../../../../shared/services/response.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

interface Configuration {
  title: string;
  viewTitle: string;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  configurations: Configuration[] = [
    { title: 'Terms and Conditions', viewTitle: 'Terms and Conditions' },
    {
      title: 'Privacy and Confidentiality',
      viewTitle: 'Privacy and Confidentiality',
    },
    {
      title: 'Return and Refund Policy',
      viewTitle: 'Return and Refund Policy',
    },
    {
      title: 'About Us',
      viewTitle: 'About Us',
    },
  ];
  configurationForm!: FormGroup;
  htmlContent = '';
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.configurationForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required]),
    });
  }

  submit = () => {
    const configurationData = this.configurationForm.value;
    console.log(this.configurationForm.value);

    this.configurationService
      .createConfiguration(configurationData)
      .subscribe((res) => {
        if (this.snackBarService.fire(res)) {
          this.configurationForm.reset();
          this.router.navigate(['/dashboard/configuration/list']);
        }
      });
  };
}
