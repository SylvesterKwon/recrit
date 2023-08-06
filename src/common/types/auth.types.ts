import { User } from 'src/user/entities/user.entity';

export type RequestWithUserInfo = Request & { user: User };
