import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { of, ReplaySubject, Subject } from 'rxjs';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { SystemService } from 'src/app/shared/services/system.service';
import { SalesSearchService } from '../../../../services/sales-search.service';
import { UserEntity } from 'src/app/shared/enum/user-entity.enum';

@Component({
  selector: 'app-sales-search',
  templateUrl: './sales-search.component.html',
  styleUrls: ['./sales-search.component.scss'],
})
export class SalesSearchComponent implements OnInit {
  searchForm: FormGroup;
  minDate = new Date();
  minfromDate = new Date();
  fromDate: string = '';
  toDate: string = '';
  firstText: string = '';
  secondText: string = '';
  thirdText: string = '';

  initialEntityObject = {
    entityList: [],
    entityId: '',
    entityInfoTemporary: {},
    entityInfo: '',
    entityLoading: false,
    secondEntityList: [],
    secondEntityId: '',
    secondEntityInfoTemporary: {},
    secondEntityInfo: '',
    secondEntityLoading: false,
    thirdEntityList: [],
    thirdEntityId: '',
    thirdEntityInfoTemporary: {},
    thirdEntityInfo: '',
    thirdEntityLoading: false,
  };

  entityObject: any = this.initialEntityObject;

  dropdownList: any[] = [];
  dropdownId: string = '';
  dropdownInfoTemporary: string = '';
  dropdownInfo: string = '';
  secondDropdownList: any[] = [];
  secondDropdownId: string = '';
  secondDropdownInfoTemporary: string = '';
  secondDropdownInfo: string = '';

  protected _onDestroy = new Subject<void>();

  isDropdownSearching = false;
  dropdownFiltering: FormControl = new FormControl();
  dropdownOptions: Array<{ id: string; name: string }> = [];
  filteredDropdownOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  isSecondDropdownSearching = false;
  secondDropdownFiltering: FormControl = new FormControl();
  secondDropdownOptions: Array<{ id: string; name: string }> = [];
  filteredSecondDropdownOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);

  searchedItem: any;
  showError: boolean = true;
  userEntity = UserEntity;

  @Input() entity: string = '';
  @Input() secondEntity: string = '';
  @Input() thirdEntity: string = '';
  @Input() dropdown: string = '';
  @Input() secondDropdown: string = '';
  @Input() limit: number = 10;
  @Input() sort: string = 'firstName';
  @Input() order: string = 'ASC';
  @Input() isApproved: number = 1;
  @Input() isAdmin: boolean = true;
  @Input() from_date: boolean = false;
  @Input() to_date: boolean = false;
  @Input() first_text: string = '';
  @Input() second_text: string = '';
  @Input() third_text: string = '';
  @Input() gap: string = '10px';

  @Input() entityFlex: number = 32;
  @Input() secondEntityFlex: number = 32;
  @Input() thirdEntityFlex: number = 32;
  @Input() dropdownFlex: number = 32;
  @Input() secondDropdownFlex: number = 32;
  @Input() first_textFlex: number = 22;
  @Input() second_textFlex: number = 22;
  @Input() third_textFlex: number = 22;
  @Input() from_dateFlex: number = 18;
  @Input() to_dateFlex: number = 18;
  @Input() searchFormFlex: number = 82;
  @Input() searchFlex: number = 18;
  @Input() multipleRow: boolean = false;

  @Output() submitSearch: any = new EventEmitter<string>();
  initialError: boolean;
  entityArray: any[] = [];

  constructor(
    private salesSearchService: SalesSearchService,
    private readonly cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private systemService: SystemService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.searchForm = this.fb.group({
      entityText: [''],
      entityId: [''],
      secondEntityText: [''],
      secondEntityId: [''],
      thirdEntityText: [''],
      thirdEntityId: [''],
      dropdownId: [''],
      secondDropdownId: [''],
      fromDate: [''],
      toDate: [''],
      firstText: [''],
      secondText: [''],
      thirdText: [''],
    });

    this.entityObject = this.initialEntityObject;

    this.dropdownId = '';
    this.dropdownInfoTemporary = '';
    this.dropdownInfo = '';
    this.secondDropdownId = '';
    this.secondDropdownInfoTemporary = '';
    this.secondDropdownInfo = '';
    // this.thirdDropdownId = '';
    // this.thirdDropdownInfoTemporary = '';
    // this.thirdDropdownInfo = '';

    this.fromDate = '';
    this.toDate = '';
    this.firstText = '';
    this.secondText = '';
    this.thirdText = '';

    this.searchedItem = {
      entityId: this.entityObject.entityId,
      secondEntityId: this.entityObject.secondEntityId,
      thirdEntityId: this.entityObject.thirdEntityId,
      dropdownId: this.dropdownId,
      secondDropdownId: this.secondDropdownId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      firstText: this.firstText,
      secondText: this.secondText,
      thirdText: this.thirdText,
    };

    if (this.dropdown) {
      this.getDropdownOptions('dropdown', this.dropdown);
    }
    if (this.secondDropdown) {
      this.getDropdownOptions('secondDropdown', this.secondDropdown);
    }

    this.entityArray = [];

    if (this.entity) {
      // this.entitySearch();
      let entityObject = this.makeObject('entity');
      this.entityArray.push(entityObject);
      this.entityMasterSearch('entity');
    }
    if (this.secondEntity) {
      // this.secondEntitySearch();
      let entityObject = this.makeObject('secondEntity');
      this.entityArray.push(entityObject);
      this.entityMasterSearch('secondEntity');
    }
    if (this.thirdEntity) {
      // this.thirdEntitySearch();
      let entityObject = this.makeObject('thirdEntity');
      this.entityArray.push(entityObject);
      this.entityMasterSearch('thirdEntity');
    }
  };

  makeObject = (str: string = 'entity') => {
    return {
      id: str + 'Id',
      name: str,
      value: this[str as keyof SalesSearchComponent],
      flex: this[(str + 'Flex') as keyof SalesSearchComponent],
      text: str + 'Text',
      info: str + 'Info',
      list: str + 'List',
      loading: str + 'Loading',
    };
  };

  entityMasterSearch = (entity: string = 'entity') => {
    let text = entity + 'Text';
    let list = entity + 'List';
    let loading = entity + 'Loading';

    let control = this.searchForm.controls[text];

    control.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((term) => {
          control.markAsTouched();
          control.setErrors({ no_result: false });
          if (term && term.length > 2 && this.showError) {
            this.entityObject[loading] = true;
            const page = 1;
            const limit = this.limit;
            const sort = this.sort;
            const order = this.order;
            const isApproved = this.isApproved;
            this.initialError = true;

            return this.salesSearchService.entitySearch(
              page,
              limit,
              sort,
              order,
              isApproved,
              term,
              this[entity as keyof SalesSearchComponent]
            );
          } else {
            this.initialError = false;
            return of([]);
          }
        }),
        delay(500)
        //tap(console.log)
      )
      .subscribe((res: any) => {
        this.showError = true;
        this.entityObject[loading] = false;
        this.entityObject[list] = [];
        this.entityObject[list] = res;
        if (res.length == 0 && this.initialError) {
          control.setErrors({
            no_result: true,
          });
        }
      });
  };

  entitySelected = ($event: any, theEntity = 'entity') => {
    this.showError = false;
    let selectedEntity = $event.option.value;

    if (selectedEntity) {
      let entity = this[theEntity as keyof SalesSearchComponent];

      let entityText: AbstractControl =
        this.searchForm.controls[theEntity + 'Text'];
      let entityId: AbstractControl =
        this.searchForm.controls[theEntity + 'Id'];

      entityText.setValue(selectedEntity['name']);

      if (this.userEntity[entity]) {
        entityId.setValue(selectedEntity[entity]['id']);
      } else {
        entityId.setValue(selectedEntity['id']);
      }

      this.entityObject[theEntity + 'InfoTemporary'] = selectedEntity;
    }
  };

  emptyEntity = (entity: string = 'entity') => {
    this.searchForm.controls[entity + 'Text'].setValue('');
    this.searchForm.controls[entity + 'Id'].setValue('');
    this.entityObject[entity + 'InfoTemporary'] = {};
    // this.entityObject[entity + 'Info'] = '';
  };

  getDropdownOptions = (
    theDropdown: string = '',
    dropdownName: string = ''
  ) => {
    this.salesSearchService
      .getDropdown(dropdownName)
      .pipe(
        tap((res) => {
          if (theDropdown == 'dropdown') {
            this.dropdownOptions = res;
            // console.log(this.dropdownOptions);
            this.filteredDropdownOptions.next(this.dropdownOptions);
          } else if (theDropdown == 'secondDropdown') {
            this.secondDropdownOptions = res;
            this.filteredSecondDropdownOptions.next(this.secondDropdownOptions);
          }
        }),
        switchMap(() => {
          if (theDropdown == 'dropdown') {
            return this.filterDropdown();
          } else if (theDropdown == 'secondDropdown') {
            return this.filterSecondDropdown();
          } else {
            return of([]);
          }
        })
      )
      .subscribe(
        (filtered) => {
          if (theDropdown == 'dropdown') {
            this.isDropdownSearching = false;
            this.filteredDropdownOptions.next(filtered);
          } else if (theDropdown == 'secondDropdown') {
            this.isSecondDropdownSearching = false;
            this.filteredSecondDropdownOptions.next(filtered);
          }
        },
        () => {
          if (theDropdown == 'dropdown') {
            this.isDropdownSearching = false;
          } else if (theDropdown == 'secondDropdown') {
            this.isSecondDropdownSearching = false;
          }
        }
      );
  };

  filterDropdown = () => {
    return this.dropdownFiltering.valueChanges.pipe(
      // filter((search) => !!search),
      tap(() => (this.isDropdownSearching = true)),
      takeUntil(this._onDestroy),
      debounceTime(200),
      map((search) => {
        if (!this.dropdownOptions) {
          return [];
        }
        return this.dropdownOptions.filter(
          (dropdown) =>
            dropdown.name.toLowerCase().indexOf(search.toLowerCase()) > -1
        );
      }),
      delay(500),
      takeUntil(this._onDestroy)
    );
  };

  filterSecondDropdown = () => {
    return this.secondDropdownFiltering.valueChanges.pipe(
      // filter((search) => !!search),
      tap(() => (this.isSecondDropdownSearching = true)),
      takeUntil(this._onDestroy),
      debounceTime(200),
      map((search) => {
        if (!this.secondDropdownOptions) {
          return [];
        }
        return this.secondDropdownOptions.filter(
          (secondDropdown) =>
            secondDropdown.name.toLowerCase().indexOf(search.toLowerCase()) > -1
        );
      }),
      delay(500),
      takeUntil(this._onDestroy)
    );
  };

  dropdownSelected = (
    theDropdown = 'dropdown',
    name: string = '',
    $event: any = ''
  ) => {
    // console.log(name);
    // console.log(theDropdown);

    if ($event) {
      $event.stopPropagation();
    }

    if (theDropdown == 'dropdown') {
      this.dropdownInfoTemporary = name;
      if (!name) {
        this.searchForm.controls.dropdownId.setValue('');
      }
    } else if (theDropdown == 'secondDropdown') {
      this.secondDropdownInfoTemporary = name;
      if (!name) {
        this.searchForm.controls.secondDropdownId.setValue('');
      }
    }
  };

  onfromDateChange = (data: any) => {
    this.minfromDate = data.value;
  };

  clearDate = (dateField: string) => {
    this.searchForm.controls[dateField].setValue('');
  };

  hasSearchParameter = () => {
    return (
      this.entityObject.entityInfo ||
      this.entityObject.secondEntityInfo ||
      this.entityObject.thirdEntityInfo ||
      this.fromDate ||
      this.toDate ||
      this.firstText ||
      this.secondText ||
      this.thirdText ||
      this.dropdownInfo ||
      this.secondDropdownInfo
    );
  };

  search = () => {
    const {
      entityId,
      secondEntityId,
      thirdEntityId,
      dropdownId,
      secondDropdownId,
      fromDate,
      toDate,
      firstText,
      secondText,
      thirdText,
    } = this.searchForm.value;

    // console.log(this.searchForm.value);
    console.log(this.entityObject);

    this.entityObject.entityInfo = this.entityObject.entityInfoTemporary?.name;
    this.entityObject.secondEntityInfo =
      this.entityObject.secondEntityInfoTemporary?.name;
    this.entityObject.thirdEntityInfo =
      this.entityObject.thirdEntityInfoTemporary?.name;

    this.dropdownInfo = this.dropdownInfoTemporary;
    this.secondDropdownInfo = this.secondDropdownInfoTemporary;

    this.dropdownId = dropdownId;
    this.secondDropdownId = secondDropdownId;

    this.firstText = firstText;
    this.secondText = secondText;
    this.thirdText = thirdText;

    this.fromDate = fromDate
      ? this.systemService.convertDateToString(fromDate)
      : '';
    this.toDate = toDate ? this.systemService.convertDateToString(toDate) : '';

    this.searchedItem = {
      entityId: entityId,
      secondEntityId: secondEntityId,
      thirdEntityId: thirdEntityId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      firstText: firstText,
      secondText: secondText,
      thirdText: thirdText,
      dropdownId: dropdownId !== '' ? dropdownId : '',
      secondDropdownId: secondDropdownId !== '' ? secondDropdownId : '',
    };
    // console.log(this.entityObject);
    // console.log(this.searchedItem);
    this.submitSearch.emit(this.searchedItem);
  };

  reset = () => {
    this.initForm();
    // this.entityMasterSearch();
    // this.entitySearch();
    // this.secondEntitySearch();
    // this.thirdEntitySearch();
    this.submitSearch.emit(this.searchedItem);
  };
}
