export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface AppJwtPayload {
  sub: number;
  email: string;
  role: Role;
}

export interface AuthenticatedRequestUser extends AppJwtPayload {}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

