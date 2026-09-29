import { ZONES, ROUTE_PRICES, FARE_RULES, OTHER_ZONE_ID } from './constants';
import type { Zone, ZoneId, RouteRow, TripType, FareQuote } from './types';

/** Routes are direction-insensitive, so both directions share one key. */
const pairKey = (a: ZoneId, b: ZoneId): string => (a < b ? `${a}|${b}` : `${b}|${a}`);

/**
 * Built once at module load. Also validates the hand-edited price list and
 * warns loudly in the console, so a typo'd zone id or a duplicated route is
 * obvious rather than silently quoting on request forever.
 */
const ROUTE_INDEX: ReadonlyMap<string, RouteRow> = (() => {
  const knownIds = new Set(ZONES.map((z) => z.id));
  const index = new Map<string, RouteRow>();

  ROUTE_PRICES.forEach((row, i) => {
    const where = `ROUTE_PRICES[${i}] (${row.from} -> ${row.to})`;
    if (!knownIds.has(row.from)) console.warn(`[pricing] ${where}: unknown "from" area "${row.from}". Check the id against ZONES in constants.ts.`);
    if (!knownIds.has(row.to)) console.warn(`[pricing] ${where}: unknown "to" area "${row.to}". Check the id against ZONES in constants.ts.`);
    if (!(row.oneWay > 0)) console.warn(`[pricing] ${where}: oneWay price must be a number greater than 0.`);

    const key = pairKey(row.from, row.to);
    if (index.has(key)) {
      console.warn(`[pricing] ${where}: this route is already listed above. Direction does not matter, so list each route only once. The first one wins.`);
      return;
    }
    index.set(key, row);
  });

  return index;
})();

export const getZones = (): Zone[] => ZONES;

export const getZoneLabel = (id?: ZoneId): string =>
  ZONES.find((z) => z.id === id)?.label ?? 'Not provided';

export const isOtherZone = (id?: ZoneId): boolean => id === OTHER_ZONE_ID;

/** Zones grouped for rendering as <optgroup>s, in the order declared in ZONES. */
export const getGroupedZones = (): { name: string; zones: Zone[] }[] => {
  const groups: { name: string; zones: Zone[] }[] = [];
  ZONES.forEach((zone) => {
    const existing = groups.find((g) => g.name === zone.group);
    if (existing) existing.zones.push(zone);
    else groups.push({ name: zone.group, zones: [zone] });
  });
  return groups;
};

/**
 * The one and only place a fare number is produced.
 * Returns an 'on-request' quote rather than a wrong number whenever the
 * route is not on the price list.
 */
export function quoteFare(
  pickupZone: ZoneId | undefined,
  dropoffZone: ZoneId | undefined,
  tripType: TripType = 'one-way',
): FareQuote {
  if (!pickupZone || !dropoffZone) {
    return { status: 'on-request', reason: 'incomplete' };
  }
  if (isOtherZone(pickupZone) || isOtherZone(dropoffZone)) {
    return { status: 'on-request', reason: 'other-zone' };
  }

  const row = ROUTE_INDEX.get(pairKey(pickupZone, dropoffZone));
  if (!row) {
    return { status: 'on-request', reason: 'unlisted-pair' };
  }

  const base =
    tripType === 'round-trip'
      ? row.roundTrip ?? row.oneWay * FARE_RULES.ROUND_TRIP_MULTIPLIER
      : row.oneWay;

  return {
    status: 'fixed',
    price: Math.max(base, FARE_RULES.MIN_FARE_USD),
    tripType,
  };
}

/** "$35" or "$35.50" — never "$0.00", never "$undefined". */
export function formatPrice(usd: number): string {
  const rounded = Math.round(usd * 100) / 100;
  const body = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  return `${FARE_RULES.CURRENCY_SYMBOL}${body}`;
}

/** "Byblos (Jbeil) — Rue X, Blue Building" */
export function composeLocation(zoneId?: ZoneId, detail?: string): string {
  const trimmed = detail?.trim();
  if (!zoneId) return trimmed || 'Not provided';
  const label = getZoneLabel(zoneId);
  return trimmed ? `${label} — ${trimmed}` : label;
}

/** Customer-facing sentence explaining why there is no number yet. */
export function describeQuote(quote: FareQuote): string {
  if (quote.status === 'fixed') return '';
  switch (quote.reason) {
    case 'incomplete':
      return 'Choose a pickup and a drop-off area to see the price.';
    case 'other-zone':
      return 'Tell us where you are going on WhatsApp and we will give you a price right away.';
    case 'unlisted-pair':
    default:
      return 'We price this route personally. Send us your trip on WhatsApp and we will confirm in a minute.';
  }
}

/** "Fixed Price" once the client has signed off, "Indicative Price" before. */
export const priceLabel = (): string =>
  FARE_RULES.PRICES_CONFIRMED ? 'Fixed Price' : 'Indicative Price';
