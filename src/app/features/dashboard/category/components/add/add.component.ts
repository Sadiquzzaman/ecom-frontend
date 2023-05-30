import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../../../shared/services/response.service';
import { CategoryService } from '../../category.service';
import { ReplaySubject, Subject } from 'rxjs';
import {
  debounceTime,
  delay,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { ImageSnippetDto } from '../../../../../core/dto/image.dto';
import { CategoryDto } from '../../../../../shared/dto/category/category.dto';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit, OnDestroy {
  addCategoryForm!: FormGroup;
  isLoading = false;
  btnLabel = 'Save';

  parentID = '';
  isSearching = false;
  parentFiltering: FormControl = new FormControl();
  parentOptions: Array<{ id: string; name: string }> = [];
  filteredParentOptions: ReplaySubject<{ id: string; name: string }[]> =
    new ReplaySubject<{ id: string; name: string }[]>(1);
  /**************** image *******************/
  selectedFile!: ImageSnippetDto;
  categoryImageName = '';
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();
  imageError = false;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly snackBarService: ResponseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.parentOptions = this.route.snapshot.data?.roots;
    this.filteredParentOptions.next(this.parentOptions);
    this.filterParent();
    this.onRootChange();
  }

  formInit = () => {
    this.addCategoryForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      position: new FormControl(null, Validators.required),
      isRootCategory: new FormControl(1, Validators.required),
      image: new FormControl(null, Validators.required),
    });
  };

  onRootChange = () => {
    this.addCategoryForm.controls.isRootCategory.valueChanges.subscribe(() => {
      this.parentID = '';
    });
  };

  filterParent = () => {
    this.parentFiltering.valueChanges
      .pipe(
        filter((search) => !!search),
        tap(() => (this.isSearching = true)),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map((search) => {
          if (!this.parentOptions) {
            return [];
          }
          return this.parentOptions.filter(
            (parent) =>
              parent.name.toLowerCase().indexOf(search.toLowerCase()) > -1
          );
        }),
        delay(500),
        takeUntil(this._onDestroy)
      )
      .subscribe(
        (filtered) => {
          this.isSearching = false;
          this.filteredParentOptions.next(filtered);
        },
        () => {
          this.isSearching = false;
        }
      );
  };

  save = () => {
    if (this.addCategoryForm.valid) {
      this.isLoading = true;
      this.saveProfileImage();
      if (this.addCategoryForm.value.isRootCategory === 1) {
        this.saveRoot();
      } else {
        this.saveChild();
      }
    } else {
      if (this.addCategoryForm.controls.image.value) {
        this.imageError = false;
      } else {
        this.imageError = true;
      }
    }
  };

  saveRoot = () => {
    const category: CategoryDto = { ...this.addCategoryForm.value };

    this.categoryService.create(category).subscribe((response: any) => {
      this.isLoading = false;
      if (this.snackBarService.fire(response)) {
        this.addCategoryForm.reset();
        this.router.navigate(['/dashboard/category']);
      } else {
        this.btnLabel = 'Try Again!';
      }
    });
  };

  saveChild = () => {
    if (this.parentID) {
      const category: CategoryDto = { ...this.addCategoryForm.value };
      this.categoryService
        .createChild(this.parentID, category)
        .subscribe((response: any) => {
          this.isLoading = false;
          if (this.snackBarService.fire(response)) {
            this.addCategoryForm.reset();
            this.router.navigate(['/dashboard/category']);
          } else {
            this.btnLabel = 'Try Again!';
          }
        });
    }
  };

  /********************** image ************************/
  waitForImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippetDto(event.target.result, file);
      this.categoryService.uploadImageRedis(this.selectedFile.file).subscribe(
        (res) => {
          this.categoryImageName = res.filename;
          this.addCategoryForm.controls.image.setValue(this.categoryImageName);
        },
        (err) => {
          console.log(err);
        }
      );
      this.imageError = false;
    });
    reader.readAsDataURL(file);
  };

  saveProfileImage = () => {
    this.categoryService.uploadImage(this.categoryImageName).subscribe(() => {
      console.log('Image uploaded to server successfully');
    });
  };

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
