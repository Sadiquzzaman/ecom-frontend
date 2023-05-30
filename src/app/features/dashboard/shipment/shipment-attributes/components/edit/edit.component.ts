import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from 'src/app/shared/services/response.service';
import { ShipmentAttributeService } from '../../shipment-attribute.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  editAttributeGroupForm!: FormGroup;
  attrGroupPosition: number = 0;
  id = '';
  isLoading = false;
  btnLabel = 'Update';

  constructor(
    private readonly shipmentAttributeService: ShipmentAttributeService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.data);
    this.initForm(this.route.snapshot.data?.shipmentAttr);
  }

  initForm = (shipmentAttribute: any) => {
    this.id = shipmentAttribute?.id;
    this.editAttributeGroupForm = new FormGroup({
      name: new FormControl(shipmentAttribute.name, [Validators.required]),
      description: new FormControl(shipmentAttribute.description, [
        Validators.required,
      ]),
    });
  };

  save = () => {
    if (this.editAttributeGroupForm.valid) {
      this.submitProductAttribute();
    }
  };

  submitProductAttribute() {
    this.isLoading = true;
    this.shipmentAttributeService
      .update(this.id, this.editAttributeGroupForm.value)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          this.editAttributeGroupForm.reset();
          this.router.navigate(['/dashboard/shipment/attribute/list']);
        } else {
          this.btnLabel = 'Try Again!';
        }
      });
  }

  clearForm = () => {
    this.editAttributeGroupForm.reset();
  };
}
