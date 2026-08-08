import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Priority } from '../../common/enums';
import { CreateSubtaskDto } from './create-subtask.dto';

export class UpdateSubtaskDto extends PartialType(CreateSubtaskDto) {
  @IsOptional()
  completed?: boolean;
}
