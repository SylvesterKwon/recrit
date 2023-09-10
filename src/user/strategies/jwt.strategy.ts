import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../repositories/user.repository';
import { Reflector } from '@nestjs/core';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';

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
    if (!user) throw new UserNotFoundException();
    return user;
  }
}
