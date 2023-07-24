import { Controller, Post, Body } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserApplication } from './user.application';

@Controller('user')
export class UserController {
  constructor(private readonly userApplication: UserApplication) {}

  @Post('sign-up')
  create(@Body() signUpDto: SignUpDto) {
    return this.userApplication.signUp(signUpDto);
  }
}
