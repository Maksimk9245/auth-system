import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
@Controller('auth')
export class AuthController{
  constructor (private readonly authService: AuthService){}
@Post('register')
  async register (@Body() dto: AuthDto){
    return await this.authService.register(dto);
  }

@Post('login')
  async login(@Body() dto: AuthDto){
    return await this.authService.login(dto);
  }
@UseGuards(AuthGuard)
  @Get('profile')
  getprofile(@Request() req){
    return req.user
}
}