import { IsEnum } from 'class-validator';
import { Priority } from '../../common/enums';

export class UpdateTaskPriorityDto {
  @IsEnum(Priority)
  priority: Priority;
}
