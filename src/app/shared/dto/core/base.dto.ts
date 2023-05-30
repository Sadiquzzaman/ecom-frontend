import {ActiveStatus} from '../../enum/active.enum';

export abstract class BaseDto {
  id: string;

  version: number;

  isActive: ActiveStatus;

  createdBy: string | null;

  updatedBy: string | null;

  createAt: Date | null;

  updatedAt: Date | null;
}
