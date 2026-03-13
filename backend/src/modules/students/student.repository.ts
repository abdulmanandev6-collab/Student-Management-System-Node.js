import { query } from '../../shared/repositories/base-repository.js';

export interface StudentRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string;
  class_id: number;
  section_id: number;
  created_at: string;
  updated_at: string;
}

export async function findAllStudents(): Promise<StudentRow[]> {
  const result = await query<StudentRow>(
    `
    SELECT id, first_name, last_name, email, phone, date_of_birth, class_id, section_id, created_at, updated_at
    FROM students
    ORDER BY created_at DESC
    `
  );
  return result.rows;
}

export async function findStudentById(id: number): Promise<StudentRow | null> {
  const result = await query<StudentRow>(
    `
    SELECT id, first_name, last_name, email, phone, date_of_birth, class_id, section_id, created_at, updated_at
    FROM students
    WHERE id = $1
    `,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function createStudent(input: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null | undefined;
  date_of_birth: string;
  class_id: number;
  section_id: number;
}): Promise<StudentRow> {
  const result = await query<StudentRow>(
    `
    INSERT INTO students (first_name, last_name, email, phone, date_of_birth, class_id, section_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING id, first_name, last_name, email, phone, date_of_birth, class_id, section_id, created_at, updated_at
    `,
    [
      input.first_name,
      input.last_name,
      input.email.toLowerCase(),
      input.phone ?? null,
      input.date_of_birth,
      input.class_id,
      input.section_id
    ]
  );
  return result.rows[0]!;
}

export async function updateStudent(
  id: number,
  input: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    date_of_birth: string;
    class_id: number;
    section_id: number;
  }>
): Promise<StudentRow | null> {
  const existing = await findStudentById(id);
  if (!existing) return null;

  const next = {
    first_name: input.first_name ?? existing.first_name,
    last_name: input.last_name ?? existing.last_name,
    email: (input.email ?? existing.email).toLowerCase(),
    phone: input.phone ?? existing.phone,
    date_of_birth: input.date_of_birth ?? existing.date_of_birth,
    class_id: input.class_id ?? existing.class_id,
    section_id: input.section_id ?? existing.section_id
  };

  const result = await query<StudentRow>(
    `
    UPDATE students
    SET first_name=$1,
        last_name=$2,
        email=$3,
        phone=$4,
        date_of_birth=$5,
        class_id=$6,
        section_id=$7,
        updated_at=NOW()
    WHERE id=$8
    RETURNING id, first_name, last_name, email, phone, date_of_birth, class_id, section_id, created_at, updated_at
    `,
    [
      next.first_name,
      next.last_name,
      next.email,
      next.phone,
      next.date_of_birth,
      next.class_id,
      next.section_id,
      id
    ]
  );
  return result.rows[0] ?? null;
}

export async function deleteStudent(id: number): Promise<boolean> {
  const result = await query<{ id: number }>(`DELETE FROM students WHERE id=$1 RETURNING id`, [id]);
  return (result.rows[0]?.id ?? null) !== null;
}

