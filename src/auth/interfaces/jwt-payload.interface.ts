import { UserRole } from '../../user/enums/user.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
