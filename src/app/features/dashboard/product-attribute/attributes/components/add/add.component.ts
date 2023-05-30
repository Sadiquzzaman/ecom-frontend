import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { ResponseService } from '../../../../../../shared/services/response.service';
import { AttributeService } from '../../attribute.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  productAttributeForm!: FormGroup;
  protected _onDestroy = new Subject<void>();

  attributeGroupID = null;
  isAttributeGroupSearching = false;
  attributeGroupFiltering: FormControl = new FormControl();
  attributeGroupOptions: Array<{ id: string; name: string }> = [];
  filteredAttributeGroupOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly attributeService: AttributeService,
    private readonly snackBarService: ResponseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    console.log(this.route.snapshot.data);

    const attrGroup = this.route.snapshot.data?.attrGroup;
    const allAttrGroups = attrGroup.map((attributeGroup: any) => ({
      id: attributeGroup.id,
      name: attributeGroup.name,
    }));
    if (allAttrGroups?.length > 0) {
      this.attributeGroupOptions = allAttrGroups;
    } else {
      this.attributeGroupOptions = [];
    }

    this.filteredAttributeGroupOptions.next(this.attributeGroupOptions);
    this.fetchAllAttributeGroup();
  }

  newValue(): FormGroup {
    return this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  initForm = () => {
    this.productAttributeForm = this.formBuilder.group({
      attributeGroupID: [null, [Validators.required]],
      attributeValue: this.formBuilder.array([this.newValue()]),
    });
  };

  fetchAllAttributeGroup = () => {
    this.attributeGroupFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isAttributeGroupSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.attributeGroupOptions) {
            return [];
          }
          return this.attributeGroupOptions.filter(
            (attrGrp) =>
              attrGrp.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isAttributeGroupSearching = false;
          this.filteredAttributeGroupOptions.next(filtered);
        },
        () => {
          this.isAttributeGroupSearching = false;
        }
      );
  };

  get attrValues() {
    return <FormArray>this.productAttributeForm.controls['attributeValue'];
  }

  addValue(): void {
    this.attrValues.push(this.newValue());
  }

  removeValue(index: any): void {
    this.attrValues.removeAt(index);
  }

  save = (): void => {
    if (this.productAttributeForm.valid) {
      this.submitProductAttribute();
    }
  };

  submitProductAttribute(): void {
    console.log(this.productAttributeForm.value);

    const attributeData = this.productAttributeForm.value;
    for (const attribute of attributeData.attributeValue) {
      attribute.name =
        attribute.name.charAt(0).toUpperCase() +
        attribute.name.slice(1).toLowerCase();
    }

    this.attributeService.createAttribute(attributeData).subscribe((res) => {
      if (this.snackBarService.fire(res)) {
        this.productAttributeForm.reset();
        this.router.navigate(['/dashboard/product-attribute/list']);
      }
    });
  }

  clearForm = (): void => {
    this.productAttributeForm.reset();
  };
}
