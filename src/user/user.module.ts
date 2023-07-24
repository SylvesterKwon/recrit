import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserApplication } from './user.application';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  controllers: [UserController],
  providers: [UserApplication, UserService],
})
export class UserModule {}
