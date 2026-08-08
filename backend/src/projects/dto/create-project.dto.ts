import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Priority } from '../../common/enums';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  lead?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
