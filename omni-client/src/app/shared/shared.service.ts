import { Injectable } from '@angular/core';
import { Duration } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly apiBaseUrl = 'http://localhost:3000';

  formatSeconds(seconds: number) {
    return Duration.fromObject({ seconds }).toFormat('mm:ss');
  }
  constructor() {}
}
