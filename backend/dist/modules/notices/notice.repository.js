import { query } from '../../shared/repositories/base-repository.js';
export async function findAllNotices() {
    const result = await query(`
    SELECT id, title, content, created_by, created_at
    FROM notices
    ORDER BY created_at DESC
    `);
    return result.rows;
}
export async function createNotice(input) {
    const result = await query(`
    INSERT INTO notices (title, content, created_by)
    VALUES ($1,$2,$3)
    RETURNING id, title, content, created_by, created_at
    `, [input.title, input.content, input.created_by]);
    return result.rows[0];
}
export async function updateNotice(id, input) {
    const existing = await query(`SELECT id, title, content, created_by, created_at FROM notices WHERE id=$1`, [id]);
    const row = existing.rows[0];
    if (!row)
        return null;
    const next = {
        title: input.title ?? row.title,
        content: input.content ?? row.content
    };
    const result = await query(`
    UPDATE notices
    SET title=$1, content=$2
    WHERE id=$3
    RETURNING id, title, content, created_by, created_at
    `, [next.title, next.content, id]);
    return result.rows[0] ?? null;
}
export async function deleteNotice(id) {
    const result = await query(`DELETE FROM notices WHERE id=$1 RETURNING id`, [id]);
    return (result.rows[0]?.id ?? null) !== null;
}
