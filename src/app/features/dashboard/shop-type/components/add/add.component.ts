import { ImageSnippetDto } from './../../../../../core/dto/image.dto';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ResponseService } from '../../../../../shared/services/response.service';
import { ShopTypeService } from '../../shop-type.service';
import { SystemService } from 'src/app/shared/services/system.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit, OnDestroy {
  addShopTypeForm!: FormGroup;
  isLoading = false;
  btnLabel = 'Save';
  /**************** image *******************/
  selectedFile!: ImageSnippetDto;
  shopTypeImageName = '';
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();
  imageError: boolean = false;

  constructor(
    private readonly shopTypeService: ShopTypeService,
    private readonly snackBarService: ResponseService,
    private readonly systemService: SystemService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

  formInit = () => {
    this.addShopTypeForm = new FormGroup({
      name: new FormControl('', Validators.required),
      commission: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
    });
  };

  save = () => {
    if (this.addShopTypeForm.valid) {
      this.imageError = false;
      this.saveData();
    } else {
      if (this.addShopTypeForm['controls']['image'].invalid) {
        this.imageError = true;
      }
    }
  };

  saveData = () => {
    this.isLoading = true;
    this.systemService.convertFormControlNumber([this.addShopTypeForm.controls.commission]);
    this.saveShopTypeImage();
    this.shopTypeService
      .create(this.addShopTypeForm.value)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (this.snackBarService.fire(response)) {
          this.addShopTypeForm.reset();
          this.router.navigate(['/dashboard/shop-type']);
        } else {
          this.btnLabel = 'Try Again!';
        }
      });
  };

  /********************** image ************************/
  waitForImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippetDto(event.target.result, file);
      this.shopTypeService.uploadImageRedis(this.selectedFile.file).subscribe(
        (res) => {
          this.imageError = false;
          this.shopTypeImageName = res.filename;
          this.addShopTypeForm.controls.image.setValue(this.shopTypeImageName);
        },
        (err) => {
          this.imageError = true;
          console.log(err);
        }
      );
    });
    reader.readAsDataURL(file);
  };

  saveShopTypeImage = () => {
    this.shopTypeService.uploadImage(this.shopTypeImageName).subscribe(() => {
      console.log('Image uploaded to server successfully');
    });
  };

  fileReset() {
    this.selectedFile = <ImageSnippetDto>{};
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
