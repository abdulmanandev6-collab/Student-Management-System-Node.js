import { query } from '../../shared/repositories/base-repository.js';
export async function findUserByEmail(email) {
    const result = await query(`
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
    `, [email.toLowerCase()]);
    return result.rows[0] ?? null;
}
