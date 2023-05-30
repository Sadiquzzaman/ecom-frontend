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
import { AttributeService } from '../../attribute.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id = '';
  editProductAttributeForm!: FormGroup;
  isLoading = false;
  btnLabel = 'Update';
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
    this.initForm(this.route.snapshot.data?.attribute);
  }

  newValue(): FormGroup {
    return this.formBuilder.group({
      name: [this.route.snapshot.data?.attribute?.name, [Validators.required]],
      description: [
        this.route.snapshot.data?.attribute?.description,
        [Validators.required],
      ],
    });
  }

  initForm = (attribute: any) => {
    this.id = attribute?.id;
    console.log(attribute?.attributeGroup?.id);

    this.editProductAttributeForm = this.formBuilder.group({
      attributeGroupID: [attribute?.attributeGroup?.id, [Validators.required]],
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
    return <FormArray>this.editProductAttributeForm.controls['attributeValue'];
  }

  addValue(): void {
    this.attrValues.push(this.newValue());
  }

  removeValue(index: any): void {
    this.attrValues.removeAt(index);
  }

  save = (): void => {
    if (this.editProductAttributeForm.valid) {
      this.submitProductAttribute();
    }
  };

  submitProductAttribute(): void {
    console.log(this.editProductAttributeForm.value);

    const attributeData = this.editProductAttributeForm.value;
    for (const attribute of attributeData.attributeValue) {
      attribute.name =
        attribute.name.charAt(0).toUpperCase() +
        attribute.name.slice(1).toLowerCase();
    }

    this.isLoading = true;
    this.attributeService
      .update(this.id, this.editProductAttributeForm.value)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          this.editProductAttributeForm.reset();
          this.router.navigate(['/dashboard/product-attribute-group/list']);
        } else {
          this.btnLabel = 'Try Again!';
        }
      });
  }

  clearForm = (): void => {
    this.editProductAttributeForm.reset();
  };
}
