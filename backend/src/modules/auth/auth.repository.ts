import { query } from '../../shared/repositories/base-repository.js';
import type { Role } from '../../shared/types.js';

export interface DbUser {
  id: number;
  email: string;
  password_hash: string;
  role: Role;
  first_name: string | null;
  last_name: string | null;
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const result = await query<DbUser>(
    `
    SELECT
      u.id,
      u.email,
      u.password_hash,
      r.name as role,
      u.first_name,
      u.last_name
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.email = $1
    LIMIT 1
    `,
    [email.toLowerCase()]
  );

  return result.rows[0] ?? null;
}

