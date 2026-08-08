import { IsOptional, IsEnum } from 'class-validator';
import { Theme, AccentColor } from '../../common/enums';

export class UpdateSettingsDto {
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsEnum(AccentColor)
  accentColor?: AccentColor;
}
