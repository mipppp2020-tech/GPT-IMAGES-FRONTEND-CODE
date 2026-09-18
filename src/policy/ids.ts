/**
 * LAW 1 — Every entity has a location-aware unique ID; nothing exists
 * without one. Format: STATE-CITY-ZONE-ENTITY-SERIAL-CHECK.
 *
 * The check digit uses the Damm algorithm, as the PRD specifies. Damm is
 * chosen over Luhn because it catches all single-digit errors AND all
 * adjacent transpositions — the two mistakes a person makes reading an ID
 * off a container seal in poor light.
 *
 * IDs are immutable once issued. A malformed or duplicate generation attempt
 * is rejected, never silently corrected (Law 1, failure behaviour).
 */

/** Damm operation table (order 10, totally anti-symmetric quasigroup). */
const DAMM: readonly (readonly number[])[] = [
  [0, 3, 1, 7, 5, 9, 8, 6, 4, 2],
  [7, 0, 9, 2, 1, 5, 4, 8, 6, 3],
  [4, 2, 0, 6, 8, 7, 1, 3, 5, 9],
  [1, 7, 5, 0, 9, 8, 3, 4, 2, 6],
  [6, 1, 2, 3, 0, 4, 5, 9, 7, 8],
  [3, 6, 7, 4, 2, 0, 9, 5, 8, 1],
  [5, 8, 6, 9, 7, 2, 0, 1, 3, 4],
  [8, 9, 4, 5, 3, 6, 2, 0, 1, 7],
  [9, 4, 3, 8, 6, 1, 7, 2, 0, 5],
  [2, 5, 8, 1, 4, 3, 6, 7, 9, 0],
];

/** Compute the Damm check digit over the digits of a string. */
export function dammCheckDigit(input: string): number {
  let interim = 0;
  for (const ch of input) {
    if (ch < '0' || ch > '9') continue;
    interim = DAMM[interim][Number(ch)];
  }
  return interim;
}

export function dammIsValid(input: string): boolean {
  return dammCheckDigit(input) === 0;
}

export type EntityKind =
  | 'LEAD' | 'CUST' | 'LIFT' | 'AGMT' | 'QUOT' | 'QCIN' | 'CONT' | 'KITB'
  | 'SOPX' | 'EVID' | 'WLET' | 'PAYT' | 'CMPL' | 'PART';

export interface AiecIdParts {
  state: string;
  city: string;
  zone: string;
  entity: EntityKind;
  serial: number;
}

/**
 * Issue an ID. The check digit is computed over the digits of the whole
 * body, so a transposed serial or a mistyped zone is caught on scan.
 */
export function issueId(parts: AiecIdParts): string {
  const { state, city, zone, entity, serial } = parts;
  if (!/^[A-Z]{2}$/.test(state)) throw new Error(`state must be 2 uppercase letters, got "${state}"`);
  if (!/^[A-Z]{2,4}$/.test(city)) throw new Error(`city must be 2-4 uppercase letters, got "${city}"`);
  if (!/^[A-Z0-9]{1,4}$/.test(zone)) throw new Error(`zone must be 1-4 alphanumerics, got "${zone}"`);
  if (!Number.isInteger(serial) || serial < 0 || serial > 9999) {
    throw new Error(`serial must be 0-9999, got ${serial}`);
  }
  const body = `${state}-${city}-${zone}-${entity}-${String(serial).padStart(4, '0')}`;
  const check = dammCheckDigit(body);
  return `${body}-${check}`;
}

export function parseId(id: string): (AiecIdParts & { check: number }) | null {
  const m = /^([A-Z]{2})-([A-Z]{2,4})-([A-Z0-9]{1,4})-([A-Z]{4})-(\d{4})-(\d)$/.exec(id);
  if (!m) return null;
  const body = id.slice(0, id.lastIndexOf('-'));
  if (dammCheckDigit(body) !== Number(m[6])) return null;
  return {
    state: m[1], city: m[2], zone: m[3],
    entity: m[4] as EntityKind,
    serial: Number(m[5]),
    check: Number(m[6]),
  };
}
