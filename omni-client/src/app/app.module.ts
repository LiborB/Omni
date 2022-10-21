import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './shared/api.interceptor';
import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { environment } from '../environments/environment';
import { AuthHttpInterceptor } from './shared/auth.interceptor';
import { LayoutComponent } from './layout/layout.component';
import { PlaylistModule } from './playlist/playlist.module';
import { SongModule } from './song/song.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { QueueModule } from './queue/queue.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';

Amplify.configure({
  Auth: {
    region: 'ap-southeast-2',
    userPoolId: environment.userPoolId,
    userPoolWebClientId: environment.clientId,
  },
});

@NgModule({
  declarations: [AppComponent, LayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AmplifyAuthenticatorModule,
    HttpClientModule,
    PlaylistModule,
    SongModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    QueueModule,
    NzDividerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
