import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repositories/user.repository';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // reference: https://docs.nestjs.com/recipes/passport#implementing-passport-jwt
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private reflector: Reflector,
  ) {
    const jwtSecret = configService.get<string>('auth.jwtSecret');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }
}
