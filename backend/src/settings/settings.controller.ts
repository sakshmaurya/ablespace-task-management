import { Controller, Get, Patch, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user settings' })
  async getSettings(@Request() req) {
    return this.settingsService.getSettings(req.user._id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user settings' })
  async updateSettings(@Request() req, @Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(req.user._id, updateSettingsDto);
  }
}
