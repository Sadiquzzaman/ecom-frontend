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
import { ImageService } from 'src/app/shared/services/image.service';
import { ImageType } from 'src/app/core/enum/image-type.enum';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  editCategoryForm!: FormGroup;
  isLoading = false;
  btnLabel = 'Update';
  id = '';

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
  image: any;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly snackBarService: ResponseService,
    private route: ActivatedRoute,
    private router: Router,
    private readonly imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.parentOptions = this.route.snapshot.data?.roots;
    this.filteredParentOptions.next(this.parentOptions);
    this.formInit(this.route.snapshot.data?.category);
    this.filterParent();
    this.onRootChange();
  }

  formInit = (cat: any) => {
    this.loadImage(cat);
    this.id = cat.id;
    this.editCategoryForm = new FormGroup({
      name: new FormControl(cat.name, Validators.required),
      description: new FormControl(cat.description, Validators.required),
      position: new FormControl(cat.position, Validators.required),
      isRootCategory: new FormControl(cat.isRootCategory, Validators.required),
      image: new FormControl(cat?.image, Validators.required),
    });
    if (cat.isRootCategory === 0) {
      this.parentID = cat.parent.id;
    }
  };

  onRootChange = () => {
    this.editCategoryForm.controls.isRootCategory.valueChanges.subscribe(() => {
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
    if (this.editCategoryForm.valid) {
      console.log(this.editCategoryForm.value);
      this.isLoading = true;
      if (this.editCategoryForm.value.isRootCategory === 1) {
        this.updateRoot();
      } else {
        this.updateChild();
      }
    }
  };

  updateRoot = () => {
    const category: CategoryDto = { ...this.editCategoryForm.value };
    this.categoryService
      .update(this.id, category)
      .subscribe((response: any) => {
        console.log(response);

        this.saveProfileImage(response?.payload?.data?.image);
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          this.editCategoryForm.reset();
          this.router.navigate(['/dashboard/category']);
        } else {
          this.btnLabel = 'Try Again!';
        }
      });
  };

  updateChild = () => {
    if (this.parentID) {
      const category: CategoryDto = { ...this.editCategoryForm.value };
      this.categoryService
        .updateChild(this.id, this.parentID, category)
        .subscribe((response: any) => {
          this.saveProfileImage(response?.payload?.data?.image);
          this.isLoading = false;
          if (this.snackBarService.fire(response)) {
            this.editCategoryForm.reset();
            this.router.navigate(['/dashboard/category']);
          } else {
            this.btnLabel = 'Try Again!';
          }
        });
    }
  };

  loadImage = (category: any): void => {
    this.image = category?.image;

    if (category.image.includes('http:') || category.image.includes('assets')) {
      this.selectedFile = new ImageSnippetDto(
        category.image,
        new File(['fake'], 'fake.txt')
      );
    } else {
      this.selectedFile = new ImageSnippetDto(
        this.imageService.loadImage(category?.image, ImageType.CATEGORY),
        new File(['fake'], 'fake.txt')
      );
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
          this.editCategoryForm.controls.image.setValue(this.categoryImageName);
        },
        (err) => {
          console.log(err);
        }
      );
    });
    reader.readAsDataURL(file);
  };

  saveProfileImage = (imageName: string) => {
    const file = this.selectedFile.file;
    console.log(this.selectedFile);

    if (file.name === 'fake.txt') {
      return;
    }
    let name = file.name.split('.')[0];
    name = name.replace(/\s/g, '');

    if (imageName.indexOf(name) < 0) {
      return;
    }
    this.categoryService.uploadImage(imageName).subscribe(() => {
      console.log('Image uploaded to server successfully');
    });
  };

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
