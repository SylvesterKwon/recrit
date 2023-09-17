import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(id: string, password: string) {
    const user =
      (await this.userRepository.findByUsername(id)) ??
      (await this.userRepository.findByEmail(id));
    if (user && (await bcrypt.compare(password, user.hashedPassword))) {
      return user;
    } else {
      return null;
    }
  }

  async signIn(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
