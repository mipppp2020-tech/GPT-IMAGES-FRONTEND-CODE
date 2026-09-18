import type { CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { StatusIndicator } from './StatusIndicator';
import { useI18n, formatRupees, formatDistance } from '@/i18n';
import type { RiderLead, BuildingThumb } from '@/domain/types';
import type { LifecycleState } from '@/domain/lifecycle';

import rcc from '@/assets/thumb-rcc-frame.jpg';
import finished from '@/assets/thumb-finished-tower.jpg';
import shell from '@/assets/thumb-shell-core.jpg';
import low from '@/assets/thumb-low-rise.jpg';
import slab from '@/assets/thumb-slab.jpg';

export const THUMBS: Record<BuildingThumb, string> = {
  'rcc-frame': rcc,
  'finished-tower': finished,
  'shell-core': shell,
  'low-rise': low,
  slab,
};

/**
 * EntityCard — the single card used for every lead, everywhere.
 *
 * The list, the nearby-opportunities rail and the search results all render
 * this component. There is no second "lead card" in the codebase, which is
 * what keeps rule 18 enforceable: a spacing fix here lands on every screen.
 */
export function EntityCard({
  lead,
  action,
  onAction,
  onOpen,
  variant = 'list',
  earnMode = 'potential',
}: {
  lead: RiderLead;
  action: { label: string; icon?: IconName; tone?: 'primary' | 'secondary' };
  onAction?: () => void;
  onOpen?: () => void;
  /**
   * 'list'   — My Leads: rail carries the earning chip and a disclosure
   *            chevron; distance lives in the meta row.
   * 'nearby' — Home: rail leads with distance in the accent colour, because
   *            on the dispatch surface distance is what decides the ride.
   */
  variant?: 'list' | 'nearby';
  earnMode?: 'potential' | 'earned';
}) {
  const { t, lang } = useI18n();
  const dist = formatDistance(lead.distanceM, lang);
  const tone = action.tone ?? 'primary';
  const nearby = variant === 'nearby';

  return (
    <article className="aiec-card">
      <div className="aiec-entity">
        <img className="aiec-entity__thumb" src={THUMBS[lead.thumbnailId]} alt="" />

        <div className="aiec-entity__body">
          <button
            type="button"
            onClick={onOpen}
            className="aiec-entity__title aiec-no-clip aiec-inline-target"
            style={{ textAlign: 'start' }}
          >
            {lead.siteName}
          </button>
          <span className="aiec-entity__sub aiec-no-clip">
            {lead.locality} - {lead.pincode}
          </span>
          {nearby ? (
            /* Nearby: state and distance read together — both feed the same
               decision, "is this worth riding to right now". */
            <span className="aiec-entity__statusrow">
              <StatusIndicator status={lead.status} />
              <span className="aiec-entity__metaitem" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
                {dist.value} {t(dist.unit)} {t('common.away')}
              </span>
            </span>
          ) : (
            <>
              <span style={{ marginTop: 'var(--aiec-space-1)' }}>
                <StatusIndicator status={lead.status} />
              </span>
              <span className="aiec-entity__meta">
                <span className="aiec-entity__metaitem">
                  <Icon name="pin-filled" size={12} />
                  {dist.value} {t(dist.unit)}
                </span>
                <span className="aiec-entity__metaitem">
                  <Icon name="calendar" size={12} stroke={1.8} />
                  {lead.capturedAt}
                </span>
              </span>
            </>
          )}
        </div>

        <div className="aiec-entity__rail">
          {nearby ? (
            <span className="aiec-entity__distance">
              <Icon name="pin-filled" size={13} />
              {dist.value} {t(dist.unit)}
            </span>
          ) : (
            <span className="aiec-entity__railtop">
              <span className="aiec-entity__earn">
                <span className="aiec-entity__earnvalue">
                  {t('common.rupee')} {formatRupees(lead.riderEarningPaise, lang)}
                </span>
                {t(earnMode === 'potential' ? 'leads.earnPotential' : 'leads.earned')}
              </span>
              <Icon name="chevron-right" size={14} style={{ color: 'var(--icon-secondary)' }} />
            </span>
          )}
          <button
            type="button"
            onClick={onAction}
            className={`aiec-btn aiec-btn--compact aiec-entity__cta ${
              tone === 'primary' ? 'aiec-btn--primary' : 'aiec-btn--secondary'
            }`}
          >
            {action.icon ? <Icon name={action.icon} size={17} /> : null}
            {action.label}
          </button>
        </div>
      </div>
    </article>
  );
}

/** StatTile — the compact KPI used across the rider home. */
export function StatTile({
  value,
  label,
  icon,
  tone,
  onPress,
}: {
  value: string;
  label: string;
  icon: IconName;
  tone: 'neutral' | 'success' | 'info';
  onPress?: () => void;
}) {
  const palette: Record<typeof tone, { bg: string; fg: string }> = {
    neutral: { bg: 'var(--aiec-lifecycle-new-surface)', fg: 'var(--aiec-lifecycle-closed-accent)' },
    success: { bg: 'var(--aiec-lifecycle-done-surface)', fg: 'var(--aiec-lifecycle-done-accent)' },
    info: { bg: 'var(--aiec-lifecycle-selling-surface)', fg: 'var(--aiec-lifecycle-selling-accent)' },
  } as const;
  const c = palette[tone];
  return (
    <button type="button" className="aiec-stat" onClick={onPress}>
      <span className="aiec-stat__icon" style={{ background: c.bg, color: c.fg }}>
        <Icon name={icon} size={18} />
      </span>
      <span className="aiec-stat__body">
        <span className="aiec-stat__value">{value}</span>
        <span className="aiec-stat__label aiec-no-clip">{label}</span>
      </span>
      <Icon name="chevron-right" size={15} className="aiec-stat__chev" />
    </button>
  );
}

/**
 * AlertCard — an operational message carrying a lifecycle tone.
 * `pulse` is permitted only for blocked states and fires once (§16).
 */
export function AlertCard({
  title,
  text,
  icon = 'info',
  tone = 'info',
  action,
  pulse = false,
}: {
  title: string;
  text?: ReactNode;
  icon?: IconName;
  tone?: LifecycleState | 'info';
  action?: ReactNode;
  pulse?: boolean;
}) {
  const vars =
    tone === 'info'
      ? ({ '--alert-surface': 'var(--surface-info-weak)', '--alert-accent': 'var(--accent-info)' } as CSSProperties)
      : ({
          '--alert-surface': `var(--aiec-lifecycle-${tone}-surface)`,
          '--alert-accent': `var(--aiec-lifecycle-${tone}-accent)`,
          '--alert-text': `var(--aiec-lifecycle-${tone}-text)`,
        } as CSSProperties);

  return (
    <div className={`aiec-alert${pulse && tone === 'blocked' ? ' aiec-alert--pulse' : ''}`} style={vars}>
      <span className="aiec-alert__icon">
        <Icon name={icon} size={17} />
      </span>
      <div className="aiec-alert__body">
        <span className="aiec-alert__title aiec-no-clip">{title}</span>
        {text ? <span className="aiec-alert__text aiec-no-clip">{text}</span> : null}
      </div>
      {action}
    </div>
  );
}
