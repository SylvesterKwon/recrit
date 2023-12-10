import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from '../dto/sign-up.dto';
import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { PermissionRepository } from '../repositories/permission.repository';
import {
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
} from 'src/common/exceptions/user.exception';
import { GraphRepository } from 'src/graph/repositories/graph.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private permissionRepository: PermissionRepository,
    private graphRepository: GraphRepository,
  ) {}

  async create(dto: SignUpDto) {
    // TODO: password 복잡도 validation 및 email 형식 validation 추가

    // TODO: 유저 생성 validation 코드 복잡해지면 별도 함수로 분리
    if (await this.userRepository.findByUsername(dto.username)) {
      throw new UsernameAlreadyExistsException();
    } else if (await this.userRepository.findByEmail(dto.email)) {
      throw new EmailAlreadyExistsException();
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = this.userRepository.create({
      email: dto.email,
      username: dto.username,
      hashedPassword: hashedPassword,
      // TODO(User): sign up 시 기본 role 설정
    });

    const em = this.userRepository.getEntityManager();
    await em.flush(); // flush to generate id

    await this.graphRepository.createUserNode(user);
  }

  remove(userId: number) {
    const em = this.userRepository.getEntityManager();
    em.remove(em.getReference(User, userId));
  }

  private async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async checkPasswordMatches(user: User, password: string) {
    return await bcrypt.compare(password, user.hashedPassword);
  }

  async checkIfUserHasPermission(
    user: User,
    permissionName: string,
  ): Promise<boolean> {
    const role = await user.role?.load();
    if (!role) return false; // user has no role
    const rolePermissions = await role.permissions?.init();
    console.log(user.role);
    if (!rolePermissions) return false;
    const permission = await this.permissionRepository.findByName(
      permissionName,
    );
    if (!permission)
      throw new NotFoundException(`Permission '${permissionName}'not found.`);
    return rolePermissions.contains(permission);
  }
}
