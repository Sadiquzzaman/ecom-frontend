import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlocksRoutingModule } from './blocks-routing.module';
import { AppComponent } from './root/app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export const blockComponents = [AppComponent, NotFoundComponent];

@NgModule({
  imports: [CommonModule, BlocksRoutingModule, MatProgressBarModule],
  declarations: [...blockComponents],
  exports: [...blockComponents],
})
export class BlocksModule {}
