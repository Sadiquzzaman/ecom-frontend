import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationService } from './configuration.service';
import { EditComponent } from './components/edit/edit.component';
import { EditResolveService } from './resolvers/edit-resolve.service';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [AddComponent, ListComponent, EditComponent],
  imports: [
    CommonModule,
    SharedModule,
    ConfigurationRoutingModule,
    AngularEditorModule,
  ],
  providers: [ConfigurationService, EditResolveService],
})
export class ConfigurationModule {}
