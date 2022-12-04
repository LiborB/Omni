import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistComponent } from './artist.component';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";



@NgModule({
  declarations: [
    ArtistComponent
  ],
  imports: [
    CommonModule,
    NzPageHeaderModule
  ]
})
export class ArtistModule { }
