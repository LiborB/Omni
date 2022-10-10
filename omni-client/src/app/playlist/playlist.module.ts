import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistComponent } from './playlist.component';
import { SongModule } from '../song/song.module';
import { SharedModule } from '../shared/shared.module';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [PlaylistComponent],
  imports: [
    CommonModule,
    SongModule,
    SharedModule,
    NzPageHeaderModule,
    NzTableModule,
    NzMessageModule,
    NzGridModule,
    NzWaveModule,
    NzButtonModule,
    NzUploadModule,
    NzIconModule,
  ],
})
export class PlaylistModule {}
