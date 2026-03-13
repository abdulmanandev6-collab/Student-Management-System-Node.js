import PDFDocument from 'pdfkit';
import type { StudentCreateInput, StudentUpdateInput } from './student.schema.js';
import {
  createStudent,
  deleteStudent,
  findAllStudents,
  findStudentById,
  updateStudent
} from './student.repository.js';

export async function listStudents() {
  return findAllStudents();
}

export async function getStudent(id: number) {
  return findStudentById(id);
}

export async function addStudent(input: StudentCreateInput) {
  return createStudent(input);
}

export async function editStudent(id: number, input: StudentUpdateInput) {
  return updateStudent(id, input);
}

export async function removeStudent(id: number) {
  return deleteStudent(id);
}

export async function generateStudentReport(id: number): Promise<Buffer> {
  const student = await findStudentById(id);
  if (!student) throw new Error('Student not found');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.fontSize(25).text('Student Progress Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${student.first_name} ${student.last_name}`);
    doc.text(`Email: ${student.email}`);
    doc.text(`Phone: ${student.phone ?? 'N/A'}`);
    doc.text(`Date of Birth: ${student.date_of_birth}`);
    doc.moveDown();
    doc.text(`Class: ${student.class_id}`);
    doc.text(`Section: ${student.section_id}`);
    doc.moveDown();
    doc.text('This is a computer generated report for the Student Management System.');
    doc.end();
  });
}

