import { query } from '../../shared/repositories/base-repository.js';

export interface NoticeRow {
  id: number;
  title: string;
  content: string;
  created_by: number;
  created_at: string;
}

export async function findAllNotices(): Promise<NoticeRow[]> {
  const result = await query<NoticeRow>(
    `
    SELECT id, title, content, created_by, created_at
    FROM notices
    ORDER BY created_at DESC
    `
  );
  return result.rows;
}

export async function createNotice(input: {
  title: string;
  content: string;
  created_by: number;
}): Promise<NoticeRow> {
  const result = await query<NoticeRow>(
    `
    INSERT INTO notices (title, content, created_by)
    VALUES ($1,$2,$3)
    RETURNING id, title, content, created_by, created_at
    `,
    [input.title, input.content, input.created_by]
  );
  return result.rows[0]!;
}

export async function updateNotice(
  id: number,
  input: Partial<{ title: string; content: string }>
): Promise<NoticeRow | null> {
  const existing = await query<NoticeRow>(
    `SELECT id, title, content, created_by, created_at FROM notices WHERE id=$1`,
    [id]
  );
  const row = existing.rows[0];
  if (!row) return null;

  const next = {
    title: input.title ?? row.title,
    content: input.content ?? row.content
  };

  const result = await query<NoticeRow>(
    `
    UPDATE notices
    SET title=$1, content=$2
    WHERE id=$3
    RETURNING id, title, content, created_by, created_at
    `,
    [next.title, next.content, id]
  );
  return result.rows[0] ?? null;
}

export async function deleteNotice(id: number): Promise<boolean> {
  const result = await query<{ id: number }>(`DELETE FROM notices WHERE id=$1 RETURNING id`, [id]);
  return (result.rows[0]?.id ?? null) !== null;
}

