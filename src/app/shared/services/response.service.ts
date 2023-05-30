import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarErrorComponent } from '../components/features/site/snackbar-error/snackbar-error.component';

@Injectable()
export class ResponseService {
  constructor(private readonly snackBarService: MatSnackBar) {
  }

  fire = (response: any): boolean => {
    if (response.error && response.error.hasOwnProperty('error')) {
      response = response.error;
    } 
    // if (response.error && response.error.hasOwnProperty('response')) {
    //   response = response.response;
    // }
    if (response.error) {
      // console.log(response.error)
      this.snackBarService.openFromComponent(SnackbarErrorComponent, {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        politeness: 'assertive',
        panelClass: ['fail-snackbar'],
        data: { message: response.message, error: response.error },
      });
      return false;
    } else if (!response.error && response.payload) {
      // console.log(response)
      this.snackBarService.openFromComponent(SnackbarErrorComponent, {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        politeness: 'polite',
        panelClass: ['success-snackbar'],
        data: { message: response.message, error: null },
      });
    }
    return true;
  };

  message = (msg: string, error: boolean = true, duration = 5000) => {
    this.snackBarService.open(msg, 'X', {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      politeness: error ? 'assertive' : 'polite',
      panelClass: error ? ['fail-snackbar'] : ['success-snackbar'],
    });
  };

}
