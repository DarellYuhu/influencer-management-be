import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(payload: SignInDto) {
    const user = await this.userService.findOne(payload.username).catch(() => {
      throw new UnauthorizedException('Invalid credentials');
    });
    const isValid = bcrypt.compareSync(payload.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const jwtPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
      accessToken: this.jwtService.sign(jwtPayload),
    };
  }
}
