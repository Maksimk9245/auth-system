import {Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards,} from '@nestjs/common';
import type { Request } from 'express';import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() dto: AuthDto) {
    return await this.authService.register(dto);
  }
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return (req as any).user;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    return await this.authService.logout((req as any).user.sub);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    console.log('--- ПРИШЕЛ ТОКЕН ИЗ ПОСТМАНА ---', refreshToken);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing in the request body');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: 'refresh_secret_token',
      });
      return await this.authService.refreshTokens(payload.sub, refreshToken);
    } catch (e) {
      console.error('Refresh error details:', e);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}