import {Readable} from 'stream';
import {MailAttachmentDto} from './mail-attachment.dto';
import {MailFromDto} from './mail-from.dto';

export class MailParserDto {
  from: MailFromDto;

  to: string;

  subject: string;

  html: string | Buffer | Readable;

  attachments: MailAttachmentDto[];
}
