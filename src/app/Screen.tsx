import type { ReactNode } from 'react';
import { DemoRibbon } from '@/components/Operational';
import { DeviceStatusBar, TabBar } from '@/components/Chrome';
import type { AiecTheme } from './AppContext';

/**
 * Screen — the frame every AIEC screen is mounted in.
 *
 * It owns the device chrome, the role theme attribute, the scroll region and
 * the tab bar, so no individual screen re-implements page structure. The
 * NextAction slot sits between the scroll region and the tab bar: that is how
 * the dominant action is guaranteed to land in the bottom third (§9).
 */
export function Screen({
  theme = 'sunlight',
  header,
  children,
  nextAction,
  tabBar = true,
  statusBarTime = '9:41',
  scrollRef,
}: {
  theme?: AiecTheme;
  header?: ReactNode;
  children: ReactNode;
  nextAction?: ReactNode;
  tabBar?: boolean;
  statusBarTime?: string;
  scrollRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div className="aiec-device" data-aiec-theme={theme}>
      <DemoRibbon />
      <DeviceStatusBar time={statusBarTime} />
      {header}
      <div className="aiec-scroll" ref={scrollRef}>
        {children}
      </div>
      {nextAction}
      {tabBar ? <TabBar /> : null}
    </div>
  );
}

/** A vertical stack with the canonical page gutter and section rhythm. */
export function Stack({
  children,
  gap = 'base',
  pad = true,
  style,
}: {
  children: ReactNode;
  gap?: 'tight' | 'base' | 'loose' | 'section';
  pad?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={pad ? 'aiec-pad' : undefined}
      style={{ display: 'grid', gap: `var(--aiec-stack-${gap})`, ...style }}
    >
      {children}
    </div>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="aiec-section">
      <h2 className="aiec-section__title aiec-no-clip">{title}</h2>
      {action}
    </div>
  );
}
