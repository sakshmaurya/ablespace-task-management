import { Controller, Get, Patch, UseGuards, Request, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getCurrentUser(@Request() req) {
    return this.usersService.findById(req.user._id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateCurrentUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user._id, updateUserDto);
  }
}
