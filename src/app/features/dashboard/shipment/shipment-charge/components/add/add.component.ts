import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import {
  filter,
  takeUntil,
  tap,
  debounceTime,
  map,
  delay,
} from 'rxjs/operators';
import { ResponseService } from 'src/app/shared/services/response.service';
import { ShipmentChargeService } from '../../shipment-charge.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  shipmentChargeForm!: FormGroup;
  protected _onDestroy = new Subject<void>();

  shipmentGroupID = null;
  isShipmentGroupSearching = false;
  shipmentGroupFiltering: FormControl = new FormControl();
  shipmentGroupOptions: Array<{ id: string; name: string }> = [];
  filteredShipmentGroupOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly shipmentChargeService: ShipmentChargeService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    console.log(this.route.snapshot.data);

    const shipmentGroup = this.route.snapshot.data?.shipmentGroup;
    const allShipmentGroup = shipmentGroup.map(
      (shipmentAttributeGroup: any) => ({
        id: shipmentAttributeGroup.id,
        name: shipmentAttributeGroup.name,
      })
    );
    if (allShipmentGroup?.length > 0) {
      this.shipmentGroupOptions = allShipmentGroup;
    } else {
      this.shipmentGroupOptions = [];
    }

    this.filteredShipmentGroupOptions.next(this.shipmentGroupOptions);
    this.fetchAllShipmentGroup();
  }

  newValue(): FormGroup {
    return this.formBuilder.group({
      value: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  initForm = () => {
    this.shipmentChargeForm = this.formBuilder.group({
      shipmentGroupID: [null, [Validators.required]],
      shipmentValue: this.formBuilder.array([this.newValue()]),
    });
  };

  fetchAllShipmentGroup = () => {
    this.shipmentGroupFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isShipmentGroupSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.shipmentGroupOptions) {
            return [];
          }
          return this.shipmentGroupOptions.filter(
            (shipmentGrp) =>
              shipmentGrp.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isShipmentGroupSearching = false;
          this.filteredShipmentGroupOptions.next(filtered);
        },
        () => {
          this.isShipmentGroupSearching = false;
        }
      );
  };

  get attrValues() {
    return <FormArray>this.shipmentChargeForm.controls['shipmentValue'];
  }

  addValue(): void {
    this.attrValues.push(this.newValue());
  }

  removeValue(index: any): void {
    this.attrValues.removeAt(index);
  }

  save = (): void => {
    if (this.shipmentChargeForm.valid) {
      this.submitProductAttribute();
    }
  };

  submitProductAttribute(): void {
    console.log(this.shipmentChargeForm.value);

    const attributeData = this.shipmentChargeForm.value;

    this.shipmentChargeService
      .createAttribute(attributeData)
      .subscribe((res) => {
        if (this.snackBarService.fire(res)) {
          this.shipmentChargeForm.reset();
          this.router.navigate(['/dashboard/shipment/attribute/list']);
        }
      });
  }

  clearForm = (): void => {
    this.shipmentChargeForm.reset();
  };
}
