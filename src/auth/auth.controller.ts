import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.auth.dto';
import { Dtoregister } from './dto/register.auth.dto';
import type { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { userServis } from '../users/users.service';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userServis: userServis,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ----------------------------
  // LOGIN
  // ----------------------------
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('loginAdmin')
  loginAdmin(@Req() req, @Body() dto: LoginDto) {
    return this.authService.loginAdmin(req, dto);
  }

  @Get('admin-check')
  adminCheck(@Req() req) {
    if (req.session.admin) {
      return { loggedIn: true };
    }else{
       return { loggedIn: false };
    }  
  }
  @Post('register')
  async register(@Body() dto: Dtoregister) {
    return this.authService.register(dto);
  }

  @Get('status')
  async checkLoginStatus(@Req() req: any) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return { loggedIn: false, message: 'توکن ارسال نشده' };
    }

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = jwt.verify(token, 'MY_SUPER_SECRET');
    } catch (err) {
      return { loggedIn: false, message: 'توکن نامعتبر یا منقضی شده' };
    }

    const user = await this.userServis.findByToken(token);

    if (!user) {
      return { loggedIn: false, message: 'توکن در دیتابیس نیست' };
    }

    return {
      loggedIn: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  @Post('logout')
  async logout(@Req() req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return { success: false, message: 'No token provided' };

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = jwt.verify(token, 'MY_SUPER_SECRET');
    } catch (err) {
      return { success: false, message: 'Invalid or expired token' };
    }

    const user = await this.userServis.findByToken(token);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    user.current_token = null;
    await this.userRepo.save(user);

    return { success: true, message: 'Logged out successfully' };
  }
}
