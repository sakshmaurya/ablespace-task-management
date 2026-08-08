import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';
import { TaskStatus, Priority } from '../../common/enums';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  members?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  reporter?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  resources?: string[];
}
