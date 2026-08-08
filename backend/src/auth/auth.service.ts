import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GuestLoginDto } from './dto/guest-login.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async guestLogin(guestLoginDto: GuestLoginDto) {
    const guestName = guestLoginDto.name || `Guest_${Date.now()}`;
    const guestEmail = `guest_${Date.now()}@ablespace.local`;
    const guestUsername = `guest_${Date.now()}`;

    const guest = await this.usersService.create({
      name: guestName,
      email: guestEmail,
      username: guestUsername,
      isGuest: true,
    });

    const payload = { sub: guest._id, email: guest.email, isGuest: true };
    return {
      access_token: this.jwtService.sign(payload),
      user: guest,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, isGuest: user.isGuest };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
