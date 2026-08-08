import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { TaskStatus, Priority } from '../../common/enums';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}
