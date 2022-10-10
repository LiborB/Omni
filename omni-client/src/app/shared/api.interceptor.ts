import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private sharedService: SharedService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiReq = req.clone({
      url: `${this.sharedService.apiBaseUrl}${req.url}`,
    });

    return next.handle(apiReq);
  }
}
