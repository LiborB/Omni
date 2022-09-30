import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthenticatorService} from "@aws-amplify/ui-angular";
import {Observable} from "rxjs";

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticatorService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${this.authService.user.getSignInUserSession()?.getIdToken().getJwtToken()}`)
    })

    return next.handle(authReq)
  }
}
