import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ApiInterceptor} from "./shared/api.interceptor";
import {Amplify} from "aws-amplify";
import {AmplifyAuthenticatorModule} from "@aws-amplify/ui-angular";
import {environment} from "../environments/environment";
import {AuthHttpInterceptor} from "./shared/auth.interceptor";

Amplify.configure({
  Auth: {
    region: "ap-southeast-2",
    userPoolId: environment.userPoolId,
    userPoolWebClientId: environment.clientId
  }
})

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAuthenticatorModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiInterceptor,
    multi: true
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHttpInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
