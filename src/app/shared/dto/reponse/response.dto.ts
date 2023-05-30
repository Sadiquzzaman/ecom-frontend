import {PageResponseDto} from '../pagination/page-response.dto';
import {ErrorDto} from './error.dto';
import {PayloadDto} from './payload.dto';

export class ResponseDto {
  constructor(
    public nonce: number,
    public status: number,
    public message: string,
    public error?: ErrorDto,
    public payload?: PayloadDto,
    public page?: PageResponseDto,
  ) {
  }
}
