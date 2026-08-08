import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private usersService: UsersService) {}

  async getSettings(userId: string) {
    const user = await this.usersService.findById(userId);
    return {
      theme: user.theme,
      accentColor: user.accentColor,
    };
  }

  async updateSettings(userId: string, updateSettingsDto: UpdateSettingsDto) {
    return this.usersService.update(userId, updateSettingsDto);
  }
}
