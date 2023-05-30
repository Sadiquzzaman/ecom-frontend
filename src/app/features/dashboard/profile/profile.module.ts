import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileService } from './profile.service';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, SharedModule, ProfileRoutingModule],
  providers: [ProfileService],
})
export class ProfileModule {}
