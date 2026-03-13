import { query } from '../../shared/repositories/base-repository.js';
export async function findAllStudents() {
    const result = await query(`
    SELECT id, first_name, last_name, email, phone, date_of_birth, class_id, section_id, created_at, updated_at
    FROM students
    ORDER BY created_at DESC
    `);
    return result.rows;
}
export async function findStudentById(id) {
    const result = await query(`
    SELECT id, first_name, last_name, email, phone, date_of_birth, class_id, section_id, created_at, updated_at
    FROM students
    WHERE id = $1
    `, [id]);
    return result.rows[0] ?? null;
}
export async function createStudent(input) {
    const result = await query(`
    INSERT INTO students (first_name, last_name, email, phone, date_of_birth, class_id, section_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING id, first_name, last_name, email, phone, date_of_birth, class_id, section_id, created_at, updated_at
    `, [
        input.first_name,
        input.last_name,
        input.email.toLowerCase(),
        input.phone ?? null,
        input.date_of_birth,
        input.class_id,
        input.section_id
    ]);
    return result.rows[0];
}
export async function updateStudent(id, input) {
    const existing = await findStudentById(id);
    if (!existing)
        return null;
    const next = {
        first_name: input.first_name ?? existing.first_name,
        last_name: input.last_name ?? existing.last_name,
        email: (input.email ?? existing.email).toLowerCase(),
        phone: input.phone ?? existing.phone,
        date_of_birth: input.date_of_birth ?? existing.date_of_birth,
        class_id: input.class_id ?? existing.class_id,
        section_id: input.section_id ?? existing.section_id
    };
    const result = await query(`
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
    `, [
        next.first_name,
        next.last_name,
        next.email,
        next.phone,
        next.date_of_birth,
        next.class_id,
        next.section_id,
        id
    ]);
    return result.rows[0] ?? null;
}
export async function deleteStudent(id) {
    const result = await query(`DELETE FROM students WHERE id=$1 RETURNING id`, [id]);
    return (result.rows[0]?.id ?? null) !== null;
}
