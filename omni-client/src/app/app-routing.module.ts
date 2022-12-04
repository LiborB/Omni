import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { PlaylistComponent } from './playlist/playlist.component';
import {ArtistComponent} from "./artist/artist.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: "/playlist",
    pathMatch: "full"
  },
  {
    path: 'playlist/:id',
    component: PlaylistComponent,
  },
  {
    path: 'playlist',
    component: PlaylistComponent,
  },
  {
    path: "artist/:id",
    component: ArtistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
