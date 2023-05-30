import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-facebook-chat',
  templateUrl: './facebook-chat.component.html',
  styleUrls: ['./facebook-chat.component.scss'],
})
export class FacebookChatComponent implements OnInit {
  constructor(private readonly facebookService: FacebookService) {}

  facebook_page_id = environment.facebook_page_id;

  ngOnInit(): void {
    this.initFacebookService();
    var chatDiv = document.getElementsByClassName('fb-customerchat');
    chatDiv[0].setAttribute('page_id', this.facebook_page_id);
  }

  // sabbir
  private initFacebookService(): void {
    const initParams: InitParams = { xfbml: true, version: 'v3.2' };
    this.facebookService.init(initParams);
  }

  // shouvon
  // initFacebookService = () => {
  //   const initParams: InitParams = {
  //     // appId: '100751849181031',
  //     // appId: environment.facebook_app_id,
  //     // autoLogAppEvents: true,
  //     xfbml: true,
  //     version: 'v3.2',
  //   };
  //   this.facebookService.init(initParams);
  // };
}
