import type { NoticeCreateInput, NoticeUpdateInput } from './notice.schema.js';
import { createNotice, deleteNotice, findAllNotices, updateNotice } from './notice.repository.js';

export async function listNotices() {
  return findAllNotices();
}

export async function addNotice(createdBy: number, input: NoticeCreateInput) {
  return createNotice({ ...input, created_by: createdBy });
}

export async function editNotice(id: number, input: NoticeUpdateInput) {
  return updateNotice(id, input);
}

export async function removeNotice(id: number) {
  return deleteNotice(id);
}

