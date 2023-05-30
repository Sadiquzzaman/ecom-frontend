import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AddComponent } from './components/add/add.component';
import { UserRoutingModule } from './user-routing.module';
import { EditComponent } from './components/edit/edit.component';
import { UserProfileComponent } from './components/user-profile/components/user-profile/user-profile.component';
import { ProfileEditComponent } from './components/user-profile/components/edit/profile-edit.component';
import { UserProfileService } from './components/user-profile/userprofile.service';
import { EditProfileResolveService } from './components/user-profile/resolver/edit-profile-resolve.service';
import { AuthService } from '../../auth/auth.service';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../../environments/environment';
import { MerchantListComponent } from './components/merchant-list/merchant-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { MerchantUnapprovedListComponent } from './components/merchant-unapproved-list/merchant-unapproved-list.component';
import { MerchantApprovedListComponent } from './components/merchant-approved-list/merchant-approved-list.component';
import { TransporterListComponent } from './components/transporter-list/transporter-list.component';
import { ShopManagerListComponent } from './components/shop-manager-list/shop-manager-list.component';

@NgModule({
  declarations: [
    EditComponent,
    AddComponent,
    UserProfileComponent,
    ProfileEditComponent,
    MerchantListComponent,
    CustomerListComponent,
    AdminListComponent,
    MerchantUnapprovedListComponent,
    MerchantApprovedListComponent,
    TransporterListComponent,
    ShopManagerListComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_map_api,
      libraries: ['places'],
    })
  ],
  providers: [
    UserProfileService,
    EditProfileResolveService,
    AuthService
  ],
})
export class UserModule { }
