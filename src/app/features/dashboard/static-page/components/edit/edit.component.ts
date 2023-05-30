import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticPageService } from '../../static-page.service';
import { ResponseService } from '../../../../../shared/services/response.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  editConfigurationForm!: FormGroup;
  id = '';
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
    private route: ActivatedRoute,
    private readonly configurationService: StaticPageService,
    private readonly rS: ResponseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.data?.editConfiguration);
    this.initForm(this.route.snapshot.data?.editConfiguration);

    console.log(this.router.url);
  }

  initForm(editConfiguration: any) {
    this.id = editConfiguration.id;
    this.editConfigurationForm = new FormGroup({
      name: new FormControl(editConfiguration.name, [Validators.required]),
      value: new FormControl(editConfiguration.value, [Validators.required]),
    });
  }

  update = () => {
    if (this.editConfigurationForm.valid) {
      this.configurationService
        .update(this.id, this.editConfigurationForm.value)
        .subscribe((res) => {});
    } else {
      this.rS.message('Please fill all the fields!!');
    }
  };
}
