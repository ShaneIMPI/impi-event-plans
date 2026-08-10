import Dexie from "dexie";

// Offline-first draft storage. Everything lives in the browser (IndexedDB) —
// no backend, no subscription cost. Drafts persist across sessions so Shane
// can start an event, close the browser, and resume later.
export const db = new Dexie("impiEventPlansDB");

db.version(1).stores({
  drafts: "id, eventName, updatedAt",
});

export async function saveDraft(draft) {
  const now = new Date().toISOString();
  const record = {
    ...draft,
    updatedAt: now,
    createdAt: draft.createdAt || now,
  };
  await db.drafts.put(record);
  return record;
}

export async function listDrafts() {
  const all = await db.drafts.toArray();
  return all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getDraft(id) {
  return db.drafts.get(id);
}

export async function deleteDraft(id) {
  return db.drafts.delete(id);
}

export function newDraftId() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
