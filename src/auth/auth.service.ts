import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { userServis } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.auth.dto';
import { Dtoregister } from './dto/register.auth.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: userServis,
  ) {}

  async register(dto: Dtoregister) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.createUser({
      name: dto.name,
      username: dto.username,
      password_hash: hashedPassword,
      role: 'user',
      is_active: true,
    });

    return {
      success: true,
      message: 'Register Successful',
      data: user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByUsername(dto.username);

    if (!user) throw new UnauthorizedException('Invalid username or password');

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);

    if (!isMatch)
      throw new UnauthorizedException('Invalid username or password');

    if (!user.is_active)
      throw new ForbiddenException('Your account is inactive');

    if (user.role !== 'user') {
      throw new ForbiddenException('Access denied: You are not a normal user');
    }

    const token = jwt.sign(
      {
        sub: user.id,
        username: user.username,
        role: user.role,
      },
      'MY_SUPER_SECRET',
      { expiresIn: '7d' },
    );

    user.current_token = token;
    await this.userRepo.save(user);

    return {
      success: true,
      message: 'Login successful',
      token,
      user,
    };
  }
  async loginAdmin(req: any, dto: LoginDto) {
    const admin = await this.userService.findByUsername(dto.username);

    if (!admin) throw new UnauthorizedException('Invalid username or password');
    if (admin.password_hash !== dto.password)
      throw new UnauthorizedException('Invalid username or password');
    if (admin.role !== 'admin') throw new ForbiddenException('Access denied');
    if (!admin.is_active)
      throw new ForbiddenException('Your account is inactive');

   
    const adminLog = (req.session.admin = {
      id: admin.id,
      username: admin.username,
      loggedIn: true,
      createdAt: Date.now(),
    });

    if (!req.session.admin || !req.session.admin.loggedIn) {
      return {
        loggedIn: false,
        message: 'Session creation failed',
      };
    }
    return {
      success: true,
      message: 'Login successful',
      Log: adminLog,
    };
  }
}
