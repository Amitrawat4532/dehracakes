import type {
  CustomCakeEnquiryInput,
  PreorderInput,
  SubmissionResult,
} from "@/lib/types";

/**
 * Frontend-only submission layer for the demo. Submissions are kept in
 * localStorage so the flow can be shown end to end.
 *
 * To go live, replace `persist` with Supabase inserts, e.g.
 *
 *   await supabase.from("preorders").insert(row)
 *   await supabase.from("enquiries").insert(row)
 *
 * (ideally via a Server Action so keys never reach the browser).
 */

const STORAGE_KEY = "dehra:submissions";

type StoredSubmission =
  | ({ kind: "preorder" } & PreorderInput & SubmissionResult)
  | ({ kind: "enquiry" } & CustomCakeEnquiryInput & SubmissionResult);

function makeReference(prefix: string) {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-${n}`;
}

function persist(entry: StoredSubmission) {
  try {
    const existing: StoredSubmission[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing].slice(0, 20)));
  } catch {
    // Storage can be unavailable (private mode); the confirmation still renders.
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function submitPreorder(input: PreorderInput): Promise<SubmissionResult> {
  await wait(900);
  const result = { reference: makeReference("DC"), createdAt: new Date().toISOString() };
  persist({ kind: "preorder", ...input, ...result });
  return result;
}

export async function submitCustomCakeEnquiry(
  input: CustomCakeEnquiryInput,
): Promise<SubmissionResult> {
  await wait(900);
  const result = { reference: makeReference("CC"), createdAt: new Date().toISOString() };
  persist({ kind: "enquiry", ...input, ...result });
  return result;
}
