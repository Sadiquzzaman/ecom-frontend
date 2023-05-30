import { ImageSnippetDto } from './../../../../../core/dto/image.dto';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ResponseService } from '../../../../../shared/services/response.service';
import { ShopTypeService } from '../../shop-type.service';
import { SystemService } from 'src/app/shared/services/system.service';
import { ImageService } from 'src/app/shared/services/image.service';
import { ImageType } from 'src/app/core/enum/image-type.enum';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  editShopTypeForm!: FormGroup;
  isLoading = false;
  btnLabel = 'Update';
  /**************** image *******************/
  selectedFile!: ImageSnippetDto;
  shopTypeImageName = '';
  id = '';
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  protected _onDestroy = new Subject<void>();
  image: any;

  constructor(
    private readonly shopTypeService: ShopTypeService,
    private readonly snackBarService: ResponseService,
    private readonly systemService: SystemService,
    private route: ActivatedRoute,
    private router: Router,
    private readonly imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.formInit(this.route.snapshot.data?.shopType);
  }

  formInit = (shopType: any) => {
    console.log(shopType);

    this.loadImage(shopType);
    this.id = shopType.id;
    this.editShopTypeForm = new FormGroup({
      name: new FormControl(shopType?.name, Validators.required),
      commission: new FormControl(shopType?.commission, Validators.required),
      description: new FormControl(shopType?.description, Validators.required),
      image: new FormControl(shopType?.image, Validators.required),
    });
  };

  save = () => {
    if (this.editShopTypeForm.valid) {
      this.saveData();
    }
  };

  get commission() {
    return this.editShopTypeForm.get('commission');
  }

  saveData = () => {
    this.systemService.convertFormControlNumber([
      this.editShopTypeForm.controls.commission,
    ]);

    console.log(this.editShopTypeForm.value);

    this.isLoading = true;

    this.shopTypeService.update(this.id, this.editShopTypeForm.value).subscribe(
      (res: any) => {
        this.isLoading = false;

        if (res.error && res.error.hasOwnProperty('error')) {
          res = res.error;
        }

        if (!res.error && res.payload) {
          this.saveShopTypeImage(res?.payload?.data?.image);

          if (this.snackBarService.fire(res)) {
            this.editShopTypeForm.reset();
            this.router.navigate(['/dashboard/shop-type']);
          } else {
            this.btnLabel = 'Try Again!';
          }
        }
      },
      (err) => {
        if (this.snackBarService.fire(err)) {
          console.log(err);
        }
      }
    );
  };

  /********************** image ************************/
  loadImage = (shopType: any): void => {
    this.image = shopType?.image;

    if (shopType.image.includes('http:') || shopType.image.includes('assets')) {
      this.selectedFile = new ImageSnippetDto(
        shopType.image,
        new File(['fake'], 'fake.txt')
      );
    } else {
      this.selectedFile = new ImageSnippetDto(
        this.imageService.loadImage(shopType?.image, ImageType.SHOP_TYPE),
        new File(['fake'], 'fake.txt')
      );
    }
  };

  waitForImageRes = (imageInput: any) => {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippetDto(event.target.result, file);
      this.shopTypeService.uploadImageRedis(this.selectedFile.file).subscribe(
        (res) => {
          this.shopTypeImageName = res.filename;
          this.editShopTypeForm.controls.image.setValue(this.shopTypeImageName);
        },
        (err) => {
          console.log(err);
        }
      );
    });
    reader.readAsDataURL(file);
  };

  saveShopTypeImage = (imageName: string) => {
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

    // this.shopTypeImageName

    this.shopTypeService.uploadImage(imageName).subscribe(() => {
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
