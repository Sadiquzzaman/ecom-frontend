import { Component, OnInit } from '@angular/core';

import { LoaderService } from '../../../../../../app/core/services/loader.service';
import { MicroserviceURL } from './../../../../../core/enum/microservices.enum';
import { ApiConfigService } from './../../../../../core/services/api-config.service';
import { FollowingShopsService } from './../../following-shops.service';

@Component({
  selector: 'app-following-shops',
  templateUrl: './following-shops.component.html',
  styleUrls: ['./following-shops.component.scss'],
})
export class FollowingShopsComponent implements OnInit {
  shops: any[] = [];

  baseUrl = this.apiConfigService.getUrl(MicroserviceURL.USER) + 'users';

  constructor(
    private readonly followingShopsService: FollowingShopsService,
    private readonly apiConfigService: ApiConfigService,
    private readonly loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.followShops();
  }

  followShops = () => {
    this.followingShopsService.getFollowingShops().subscribe((res) => {
      this.shops = res?.payload?.data?.followingShops;
      this.loaderService.followingShops.next(this.shops);
    });
  };
}
