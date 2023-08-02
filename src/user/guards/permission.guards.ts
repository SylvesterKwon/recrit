import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user.service';

@Injectable()
export class PermissionGuard {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    if (!permission)
      throw new InternalServerErrorException(
        'Permission not setted for current route.',
      );
    const request = context.switchToHttp().getRequest();
    const user: User | undefined = request.user;
    if (!user) throw new NotFoundException('User not found.');
    return await this.userService.checkIfUserHasPermission(user, permission);
  }
}
