import {environment} from '../../../environments/environment';
import {MicroserviceURL} from '../enum/microservices.enum';
import {Injectable} from '@angular/core';

@Injectable()
export class ApiConfigService {
  constructor() {
  }

  getUrl = (name: MicroserviceURL): string => {
    switch (name) {
      case MicroserviceURL.USER:
        return environment.user_api;

      case MicroserviceURL.CATELOG:
        return environment.catelog_api;

      case MicroserviceURL.CORE:
        return environment.core_api;

      case MicroserviceURL.IMAGE:
        return environment.image_api;

      case MicroserviceURL.PAYMENT:
        return environment.payment_api;

      case MicroserviceURL.SEARCH:
        return environment.search_api;

      case MicroserviceURL.ORDER:
        return environment.order_api;

      case MicroserviceURL.NOTIFICATION:
        return environment.notification_api;

      case MicroserviceURL.CRONJOB:
        return environment.cron_job_api;

      default: {
        return environment.user_api;
      }
    }
  };

  getImageUrl = (): string => environment.image_url;

  getPaymentMerchantApi = (): string => environment.payment_merchant_api;

  getGoogleMapApi = (): string => environment.google_map_api;

  getLoginUrl = (): string => environment.login_url;

  getRegistrationUrl = (): string => environment.registration_url;

  getCompanyUrl = (): string => environment.company_url;

  getCompanyName = (): string => environment.company_name;

  getCompanyLocation = (): { x: number; y: number } => environment.company_location;

  getCompanyPhone = (): string => environment.company_phone;

  getCompanyEmail = (): string => environment.company_email;

  getCompanyInfo = (): any => ({
    name: this.getCompanyName(),
    email: this.getCompanyEmail(),
    phone: this.getCompanyPhone(),
    location: this.getCompanyLocation(),
    url: this.getCompanyUrl(),
  });

  getNotifications = (): string => environment.notification_api;
}
