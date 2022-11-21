import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProgressBarService {

  loader: boolean = false;
  constructor() {}

  activarLoader() {
    return this.loader = true;
  }
  desactivarLoader() {
    return this.loader = false;
  }
}
