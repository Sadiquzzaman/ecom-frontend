import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ConfigurationRoutingModule } from '../configuration/configuration-routing.module';
import { SharedModule } from './../../../shared/shared.module';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { ListComponent } from './components/list/list.component';
import { EditResolveService } from './resolvers/edit-resolve.service';
import { StaticPageRoutingModule } from './static-page-routing.module';
// import { ConfigurationRoutingModule } from './configuration-routing.module';
import { StaticPageService } from './static-page.service';

@NgModule({
  declarations: [AddComponent, ListComponent, EditComponent],
  imports: [
    CommonModule,
    SharedModule,
    StaticPageRoutingModule,
    AngularEditorModule,
  ],
  providers: [StaticPageService, EditResolveService],
})
export class StaticPageModule {}
