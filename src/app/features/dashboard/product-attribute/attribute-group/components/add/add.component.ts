import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseService } from 'src/app/shared/services/response.service';
import { AttributeGroupService } from '../../attribute-group.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  addAttributeGroupForm!: FormGroup;
  attrGroupPosition: number = 0;
  text = '';
  test = '';

  constructor(
    private readonly attributeGroupService: AttributeGroupService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.data?.attr);
    const allAttrGroup = this.route.snapshot.data?.attr;
    this.attrGroupPosition = allAttrGroup.length + 1;
    this.initForm();
  }

  initForm = () => {
    this.addAttributeGroupForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      // values: new FormControl(null, [Validators.required]),
      position: new FormControl(this.attrGroupPosition, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });
  };

  save = () => {
    if (this.addAttributeGroupForm.valid) {
      this.submitProductAttribute();
    }
  };

  submitProductAttribute() {
    const attributeGroupData = this.addAttributeGroupForm.value;
    attributeGroupData.name =
      attributeGroupData.name.charAt(0).toUpperCase() +
      attributeGroupData.name.slice(1).toLowerCase();
    console.log(attributeGroupData.name);
    console.log(this.addAttributeGroupForm.value);

    if (this.addAttributeGroupForm.valid) {
      this.attributeGroupService
        .createAttributeGroups(attributeGroupData)
        .subscribe((res) => {
          if (this.snackBarService.fire(res)) {
            this.addAttributeGroupForm.reset();
            this.router.navigate(['/dashboard/product-attribute-group/list']);
          }
        });
    }
  }

  clearForm = () => {
    this.addAttributeGroupForm.reset();
  };
}
