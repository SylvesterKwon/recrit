import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';
import { UserService } from '../services/user.service';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';

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
    if (!user) throw new UserNotFoundException();
    return await this.userService.checkIfUserHasPermission(user, permission);
  }
}
