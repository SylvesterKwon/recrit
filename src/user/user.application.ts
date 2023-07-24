import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { UserService } from './user.service';

@Injectable()
export class UserApplication {
  constructor(
    private readonly orm: MikroORM,
    private readonly userService: UserService,
  ) {}

  @UseRequestContext()
  async signUp(signUpDto: SignUpDto) {
    await this.orm.em.transactional(async () => {
      await this.userService.create(signUpDto);
    });
  }
}
