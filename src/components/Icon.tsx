import type { SVGProps } from 'react';

/**
 * AIEC ICON SET
 *
 * One family, one stroke weight, one sizing rule. Icons inherit currentColor
 * so a component never hard-codes an icon colour, and the icon reads correctly
 * under both role themes without a second asset.
 *
 * Stroke is 2 at 24px and scales with the box so a 16px icon does not turn
 * into a thin grey smudge in sunlight.
 */
export type IconName =
  | 'home' | 'list' | 'wallet' | 'user' | 'bell' | 'pin' | 'pin-filled'
  | 'chevron-right' | 'chevron-down' | 'chevron-left' | 'arrow-right' | 'arrow-left'
  | 'search' | 'filter' | 'sort' | 'camera' | 'flash-off' | 'switch-camera'
  | 'check' | 'check-circle' | 'target' | 'bars' | 'rupee' | 'phone' | 'message'
  | 'more' | 'share' | 'helmet' | 'image' | 'lock' | 'cloud-off' | 'info'
  | 'alert' | 'gallery-off' | 'navigation' | 'layers' | 'locate' | 'close'
  | 'plus' | 'calendar' | 'building' | 'users' | 'lift' | 'clock' | 'shield'
  | 'sparkle' | 'upload' | 'bank' | 'wallet-card' | 'gift' | 'trophy';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'stroke'> {
  name: IconName;
  size?: number;
  /** Visual weight. Sunlight field UI uses 2; dense meta rows may use 1.75. */
  stroke?: number;
  title?: string;
}

const P: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5',
  list: 'M4 5h16M4 12h16M4 19h10',
  wallet: 'M3 7.5A2.5 2.5 0 0 1 5.5 5H18v3M3 7.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M3 7.5h16a2 2 0 0 1 2 2V15M21 15h-4a2 2 0 0 1 0-4h4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
  bell: 'M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9ZM10 18.5a2 2 0 0 0 4 0',
  pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  'pin-filled': 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z',
  'chevron-right': 'm9 5 7 7-7 7',
  'chevron-left': 'm15 5-7 7 7 7',
  'chevron-down': 'm5 9 7 7 7-7',
  'arrow-right': 'M4 12h15m-6-7 7 7-7 7',
  'arrow-left': 'M20 12H5m6 7-7-7 7-7',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4',
  filter: 'M3 5h18l-7 8v6l-4-2v-4Z',
  sort: 'M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3',
  camera: 'M3 8.5A2.5 2.5 0 0 1 5.5 6h2L9 4h6l1.5 2h2A2.5 2.5 0 0 1 21 8.5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM12 16.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  'flash-off': 'M13 3 5.5 13H11l-1 8 5-6.5M3 3l18 18',
  'switch-camera': 'M20 11a8 8 0 0 0-13.8-5.5L4 8M4 13a8 8 0 0 0 13.8 5.5L20 16M4 4v4h4M20 20v-4h-4',
  check: 'm4.5 12.5 5 5 10-11',
  'check-circle': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-9.2 2.6 2.6 4.9-5.3',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-3.2a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z',
  bars: 'M6 20v-6M12 20V7M18 20v-9',
  rupee: 'M7 4h10M7 8.5h10M16 4c0 4-3 4.5-6 4.5h-.5L16 20',
  phone: 'M5 4h3.5l1.8 4.3-2.2 1.6a12 12 0 0 0 5.9 5.9l1.6-2.2L20 15.5V19a1.6 1.6 0 0 1-1.8 1.6A16.2 16.2 0 0 1 3.4 5.8 1.6 1.6 0 0 1 5 4Z',
  message: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z',
  more: 'M12 6.2h.01M12 12h.01M12 17.8h.01',
  share: 'M12 15V4m0 0L8 8m4-4 4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4',
  helmet: 'M4 16a8 8 0 0 1 16 0M3 16h18v2H3ZM9 8.6V5.4M15 8.6V5.4',
  image: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2ZM4 16l4.5-4.5 4 4L16 12l4 4M9 9.5h.01',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z',
  'cloud-off': 'M18.5 17.5H7a4 4 0 0 1-.6-8A6 6 0 0 1 16 7M3 3l18 18',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5.5M12 7.8h.01',
  alert: 'M12 3.5 21.5 20h-19ZM12 10v4M12 17.2h.01',
  'gallery-off': 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2ZM3 3l18 18',
  navigation: 'M21 4 3.5 11.2l7.4 2.1 2.1 7.4Z',
  layers: 'm12 3 9 5-9 5-9-5ZM3 13l9 5 9-5M3 17l9 5 9-5',
  locate: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v3M12 19v3M22 12h-3M5 12H2',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  calendar: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2ZM8 3v4M16 3v4M4 10h16',
  building: 'M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M16 21V9h3a2 2 0 0 1 2 2v10M3 21h18M9 7.5h3M9 11.5h3M9 15.5h3',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.9M18 14.2a6.5 6.5 0 0 1 3.5 5.8',
  lift: 'M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM12 3v18M8.5 9 7 7 5.5 9M15.5 15 17 17l1.5-2',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5.2l3.2 2',
  shield: 'M12 3l7.5 3v5.5c0 4.6-3.1 8.2-7.5 9.5-4.4-1.3-7.5-4.9-7.5-9.5V6Z',
  sparkle: 'M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18l-1.8-5.4L4.7 10.8 10.2 9ZM18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z',
  upload: 'M12 16V4m0 0L8 8m4-4 4 4M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4',
  bank: 'M3 9.5 12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18',
  'wallet-card': 'M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5ZM3 10h18M6.5 14.5h3',
  gift: 'M4 11h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1ZM3 7.5h18V11H3ZM12 7.5V21M12 7.5S10.5 3 8.2 3a2.2 2.2 0 0 0 0 4.5ZM12 7.5S13.5 3 15.8 3a2.2 2.2 0 0 1 0 4.5Z',
  trophy: 'M7 4h10v5a5 5 0 0 1-10 0ZM7 5.5H4.5V7a3 3 0 0 0 3 3M17 5.5h2.5V7a3 3 0 0 1-3 3M9.5 20h5M12 14v6',
};

/** Icons that are solid shapes rather than strokes. */
const FILLED = new Set<IconName>(['pin-filled', 'navigation']);
/** Icons whose dot-style marks need round caps at full weight. */
const DOTTED = new Set<IconName>(['more']);

export function Icon({ name, size = 20, stroke = 2, title, ...rest }: IconProps) {
  const filled = FILLED.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path
        d={P[name]}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={DOTTED.has(name) ? stroke + 1 : stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
