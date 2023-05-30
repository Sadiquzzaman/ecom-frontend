import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ImageSnippetDto } from 'src/app/core/dto/image.dto';
import { ImageType } from 'src/app/core/enum/image-type.enum';
import { ImageService } from './image.service';
import { ResponseService } from './response.service';

@Injectable()
export class SystemService {
  constructor(
    private readonly _httpClient: HttpClient,
    private readonly snackBarService: ResponseService,
    private readonly imageService: ImageService
  ) {}

  numericRegexp: string = '[-+]?[0-9]*[.,]?[0-9]+';
  integerRegexp: string = '[0-9]+';

  // converting FormControl value into number
  convertFormControlNumber = (control: AbstractControl[]) => {
    return control.map((single) => {
      return single.setValue(parseFloat(single?.value));
    });
  };

  // converting DateTime into YYYY-MM-DD Format
  convertDateToString = (dateTime: Date) => {
    return dateTime.toLocaleDateString('en-CA');
  };

  // check a object is empty or not; true returns for empty
  isObjectEmpty = (object: any) => {
    for (var key in object) {
      if (object.hasOwnProperty(key)) return false;
    }
    return true;
  };

  // Request File to Download
  downloadFile = (
    requestUrl: string,
    fileName: string = 'Merchant Sales History',
    fileExtension: string = 'xlsx'
  ) => {
    return this._httpClient
      .get(requestUrl, { responseType: 'blob' })
      .pipe(
        map((file: Blob) => {
          this.makeFileDownloaded(file, `${fileName}.${fileExtension}`);
        })
      )
      .subscribe(
        (res) => {
          //console.log(res);
          this.snackBarService.message('File Downloaded Successfully', false);
        },
        (error) => {
          //console.log(error);
          this.snackBarService.message(
            'Failed To File Downloaded File !!!',
            true
          );
        }
      );
  };

  // make download action
  makeFileDownloaded(
    file: Blob,
    fileName: string = 'Merchant Sales History.xlsx'
  ): void {
    const blob: Blob = new Blob([file], { type: 'octet/stream' });
    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement(
      'a'
    ) as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = fileName;
    // a.setAttribute('download', fileName);
    // console.log(a);
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  }

  getRandomElementFromArray = (
    responseArray: any[],
    randomNumber: number = 8
  ) => {
    var result = new Array(randomNumber),
      len = responseArray.length,
      taken = new Array(len);
    if (randomNumber > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (randomNumber--) {
      var x = Math.floor(Math.random() * len);
      result[randomNumber] = responseArray[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  };

  enumToArray = (enumValues: any, startIndex: number = 1) => {
    // console.log(enumValues);

    var keys = Object.keys(enumValues);
    // console.log(keys);

    var keyArray = keys.slice(keys.length / 2);
    // console.log(keyArray);

    let returnArray = keyArray.map((element: any, index) => {
      let ele: any = {};
      ele['id'] = index + startIndex;
      ele['name'] = element;
      return ele;
    });

    // console.log(returnArray);
    return returnArray;
  };

  addDays = (numberOfDays: number = 1, fromDate = new Date()) => {
    let returnDate = new Date(fromDate);
    returnDate.setDate(returnDate.getDate() + numberOfDays);
    return returnDate;
  };

  checkLength($num: string | number) {
    if ($num.toString().length == 1) {
      return '0' + $num;
    } else {
      return $num;
    }
  }

  dateFormatter(
    date: string | number | Date,
    formate = 'yyyy-mm-dd',
    divider = '-'
  ) {
    if (date) {
      const dt = new Date(date);
      const mm = dt.getMonth() + 1;
      const dd = dt.getDate();
      const yyyy = dt.getFullYear();
      // console.log(yyyy + '-' + mm + '-' + dd)

      if (formate == 'mm-dd-yyyy') {
        return (
          this.checkLength(mm) + divider + this.checkLength(dd) + divider + yyyy
        );
      } else if (formate == 'dd-mm-yyyy') {
        return (
          this.checkLength(dd) + divider + this.checkLength(mm) + divider + yyyy
        );
      }
      return (
        yyyy + divider + this.checkLength(mm) + divider + this.checkLength(dd)
      );
    } else {
      return null;
    }
  }

  getImage = (
    imageName: any,
    imageType: ImageType = ImageType.PRODUCT_SMALL
  ) => {
    if (imageName.includes('http:') || imageName.includes('assets')) {
      return new ImageSnippetDto(imageName, new File(['fake'], 'fake.txt'));
    }

    return new ImageSnippetDto(
      this.imageService.loadImage(imageName, imageType),
      new File(['fake'], 'fake.txt')
    );
  };

  getImageSource = (
    imageName: any,
    imageType: ImageType = ImageType.PRODUCT_SMALL
  ) => {
    let imageObject = this.getImage(imageName, imageType);
    return imageObject.src;
  };

  attributeExtractor = (reference: any) => {
    let splittedParts = reference.split('-', 3);
    let productAttributes = splittedParts[1];
    if (splittedParts[2] != 'default') {
      productAttributes += ', ' + splittedParts[2];
    }
    return productAttributes;
  };

  loadImage = (img: any, imageType: ImageType) => {
    let showSrc;
    if (
      img?.includes('http:') ||
      img?.includes('data:') ||
      img?.includes('assets')
    ) {
      showSrc = img;
    } else {
      showSrc = this.imageService.loadImage(img, imageType);
    }

    return showSrc;
  };
}
