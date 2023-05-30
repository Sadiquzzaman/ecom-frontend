import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from 'src/app/shared/services/response.service';
import { ShipmentAttributeService } from '../../shipment-attribute.service';

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
    private readonly shipmentAttributeService: ShipmentAttributeService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.addAttributeGroupForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
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
      this.shipmentAttributeService
        .createShipmentAttributes(attributeGroupData)
        .subscribe((res) => {
          if (this.snackBarService.fire(res)) {
            this.addAttributeGroupForm.reset();
            this.router.navigate(['/dashboard/shipment/attribute/list']);
          }
        });
    }
  }

  clearForm = () => {
    this.addAttributeGroupForm.reset();
  };
}
