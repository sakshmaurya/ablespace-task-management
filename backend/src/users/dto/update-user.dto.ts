import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { Theme, AccentColor } from '../../common/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsEnum(AccentColor)
  accentColor?: AccentColor;
}
