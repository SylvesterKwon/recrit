import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserApplication } from './user.application';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User, Role, Permission] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: { expiresIn: configService.get<string>('auth.expiresIn') },
      }),
    }),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [
    UserApplication,
    UserService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class UserModule {}
