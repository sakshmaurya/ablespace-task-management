import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';
import { Priority } from '../../common/enums';

export class CreateSubtaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  members?: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
