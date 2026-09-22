"use server"
export type BookResult = { ok:true } | { ok:false; reason:'unauthorized'|'taken'|'error' }
// Legacy booking is closed. The workspace endpoint enforces approved setup,
// a current carrier offer and an atomic reservation.
export async function bookLoad(_loadId: string): Promise<BookResult> {
  return {ok:false,reason:'unauthorized'}
}
