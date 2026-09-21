import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async register (dto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException({ message: 'Invalid email or password' });
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true
      },
    });
    return user;
  }
  async login(dto: AuthDto){
    const user = await this.prisma.user.findUnique({
      where:{email: dto.email},
    });
    if (!user) {
      throw new ConflictException({ message: 'Invalid email or password' });
    }
    const isPassword = await bcrypt.compare(dto.password, user.password);
    if (!isPassword) {
      throw new UnauthorizedException({"message": "Invalid email or password"});
    }
    return {
      id: user.id,
      email: user.email
    }
  }
}
