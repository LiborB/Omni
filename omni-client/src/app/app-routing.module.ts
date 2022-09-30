import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home/home.component";

import {CanActivateApp} from "./shared/auth.guard";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    canActivate: [CanActivateApp]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanActivateApp]
})
export class AppRoutingModule { }
