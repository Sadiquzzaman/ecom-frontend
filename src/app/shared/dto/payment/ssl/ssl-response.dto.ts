export class SslResponseDto {
  status: 'SUCCESS' | 'FAILED' | 'success' | 'failed' | string;

  failedreason: string;

  sessionkey: string;

  gw: string;

  GatewayPageURL: number;

  storeBanner: number;

  storeLogo: string;

  desc: string;
}
