export interface TopSearchInterface {
  name: string;
  url: string;
  children?: Array<TopSearchInterface>;
}
