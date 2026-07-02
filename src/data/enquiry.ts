// ─────────────────────────────────────────────────────────────────────────────
// Canonical list of "what are you enquiring about" options.
// Single source of truth for the enquiry modal's select + the value we send to
// the RND CRM (so leads are tagged by offering — e.g. "Virtual Office",
// "Private Office"). Derived from the offerings in content.ts so it never drifts.
// ─────────────────────────────────────────────────────────────────────────────
import { WORKSPACES, SPACES } from './content';

export type EnquiryOption = { value: string; label: string };
export type EnquiryGroup = { label: string; options: EnquiryOption[] };

export const ENQUIRY_GROUPS: EnquiryGroup[] = [
  {
    label: 'Workspaces',
    options: WORKSPACES.map((w) => ({ value: w.name, label: w.name })),
  },
  {
    label: 'Spaces & studios',
    options: SPACES.map((s) => ({ value: s.name, label: s.name })),
  },
  {
    label: 'Other',
    options: [
      { value: 'Membership', label: 'Membership' },
      { value: 'Merchandise', label: 'Merchandise' },
      { value: 'A private tour', label: 'A private tour' },
      { value: 'Appearing on the podcast', label: 'Appearing on the podcast' },
      { value: 'Something else', label: 'Something else' },
    ],
  },
];

/** Flat set of every valid enquiry value — used to validate a pre-selected interest. */
export const ENQUIRY_VALUES: string[] = ENQUIRY_GROUPS.flatMap((g) =>
  g.options.map((o) => o.value)
);

/** Normalise an arbitrary pre-fill into a known value, falling back to "Something else". */
export function normaliseInterest(interest?: string | null): string {
  if (!interest) return '';
  return ENQUIRY_VALUES.includes(interest) ? interest : 'Something else';
}
