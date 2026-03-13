import { createNotice, deleteNotice, findAllNotices, updateNotice } from './notice.repository.js';
export async function listNotices() {
    return findAllNotices();
}
export async function addNotice(createdBy, input) {
    return createNotice({ ...input, created_by: createdBy });
}
export async function editNotice(id, input) {
    return updateNotice(id, input);
}
export async function removeNotice(id) {
    return deleteNotice(id);
}
