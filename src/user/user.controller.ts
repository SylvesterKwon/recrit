import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserApplication } from './user.application';
import { User } from './entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guards';
import {
  AuthenticationRequired,
  PermissionRequired,
} from 'src/common/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private userApplication: UserApplication) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Request() req: Request & { user: User }) {
    // TODO: Add SignInDto class validation
    return this.userApplication.signIn(req.user);
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.userApplication.signUp(signUpDto);
  }

  // TODO: 로그인 확인용 임시 API, 삭제 할 것
  @AuthenticationRequired()
  @Get('profile')
  getProfile(@Request() req: Request & { user: User }) {
    return req.user;
  }

  // TODO: 권한 확인용 임시 API, 삭제 할 것
  @PermissionRequired('admin_only_permission_1')
  @Get('admin')
  getAdminPage(@Request() req: Request & { user: User }) {
    return req.user;
  }
}
