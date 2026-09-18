/**
 * AIEC LIFECYCLE
 *
 * The eight canonical states are read directly from the map legend on the
 * Rider home reference. They are theme-independent: a state renders with the
 * same accent under sunlight and slate.
 */
export const LIFECYCLE_STATES = [
  'new',
  'selling',
  'won',
  'material',
  'installing',
  'done',
  'blocked',
  'closed',
] as const;

export type LifecycleState = (typeof LIFECYCLE_STATES)[number];

/** i18n key for each state's canonical label. */
export const LIFECYCLE_LABEL_KEY: Record<LifecycleState, string> = {
  new: 'lifecycle.new',
  selling: 'lifecycle.selling',
  won: 'lifecycle.won',
  material: 'lifecycle.material',
  installing: 'lifecycle.installing',
  done: 'lifecycle.done',
  blocked: 'lifecycle.blocked',
  closed: 'lifecycle.closed',
};

/**
 * THE FIVE-SLOT STATUS GRAMMAR (source requirement §11).
 *
 * A status is not a word. Every status answers five questions, and the type
 * system refuses to construct one that does not. This is why the codebase
 * contains no bare "Pending" / "Processing" / "Failed" string anywhere.
 */
export interface StatusGrammar {
  /** STATE — which of the eight lifecycle states this entity occupies. */
  state: LifecycleState;
  /** REASON — why it is in that state. Never omitted, never generic. */
  reason: string;
  /** CUSTODY — who holds the work right now. The user must know if it is them. */
  custody: Custody;
  /** CLOCK — the time truth: how long held, or when it is due. */
  clock: StatusClock;
  /** CONSEQUENCE — what happens next, or what fails if nothing happens. */
  consequence: string;
  /**
   * Optional list-chip wording. The references label list chips with a more
   * specific phrase than the map legend's canonical state name (e.g.
   * "फॉलो-अप आवश्यक" for a lead in the selling state). The STATE — and
   * therefore the colour — stays canonical; only the wording narrows.
   */
  chipLabel?: string;
}

export interface Custody {
  /** Party currently responsible. */
  holder: 'rider' | 'aiec' | 'customer' | 'vendor' | 'system';
  /** Display name of the specific person/team, when known. */
  name?: string;
}

export type StatusClock =
  | { kind: 'held'; since: string; elapsedLabel: string }
  | { kind: 'due'; at: string; remainingLabel: string; breached?: boolean }
  | { kind: 'none' };

/**
 * GATES (source requirement §12).
 *
 * The interface is a keyring, not a button collection. A locked action is
 * rendered as a lock with its four answers attached — never as a disabled
 * button, and never as an enabled button that fails on tap.
 */
export interface Gate {
  /** WHY LOCKED */
  reason: string;
  /** WHO CAN UNLOCK */
  unlockableBy: string;
  /** WHAT IS REQUIRED — evidence, payment or approval. */
  requirement: GateRequirement;
  /** WHAT HAPPENS NEXT once satisfied. */
  nextStep: string;
}

export type GateRequirement =
  | { kind: 'evidence'; label: string; collected: number; required: number }
  | { kind: 'payment'; label: string; amountPaise: number }
  | { kind: 'approval'; label: string; approver: string }
  | { kind: 'connectivity'; label: string };

/** An action is either open, or gated with a full explanation. Never "disabled". */
export type ActionState = { kind: 'open' } | { kind: 'gated'; gate: Gate };

export function isGated(a: ActionState): a is { kind: 'gated'; gate: Gate } {
  return a.kind === 'gated';
}
