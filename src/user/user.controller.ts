import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserApplication } from './user.application';
import { LocalAuthGuard } from './guards/local-auth.guards';
import {
  AuthenticationRequired,
  PermissionRequired,
} from 'src/common/decorators/auth.decorator';
import { UserId } from 'src/common/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private userApplication: UserApplication) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@UserId() userId: number) {
    // TODO: Add SignInDto class validation
    return this.userApplication.signIn(userId);
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.userApplication.signUp(signUpDto);
  }

  // TODO: 로그인 확인용 임시 API, 삭제 할 것
  @AuthenticationRequired()
  @Get('profile')
  getProfile(@UserId() userId: number) {
    return userId;
  }

  // TODO: 권한 확인용 임시 API, 삭제 할 것
  @PermissionRequired('admin_only_permission_1')
  @Get('admin')
  getAdminPage(@UserId() userId: number) {
    return userId;
  }
}
