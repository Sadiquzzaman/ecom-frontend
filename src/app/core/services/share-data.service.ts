import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  saveData = (key: string, data: any, json: boolean = false): void => {
    this.removeData(key);
    window.localStorage.setItem(key, json ? JSON.stringify(data) : data);
  };

  getData = (key: string): any => window.localStorage.getItem(key);

  removeData = (key: string): any => {
    window.localStorage.removeItem(key);
  };

  clear = () => {
    window.localStorage.clear();
  };
}
