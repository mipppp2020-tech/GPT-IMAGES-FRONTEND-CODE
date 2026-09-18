import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { EntityCard, AlertCard } from '@/components/EntityCard';
import { GlobalSearch } from '@/components/Operational';
import { useI18n } from '@/i18n';
import { LEAD_STATS, RIDER_LEADS } from '@/data/fixtures';
import type { RiderLead } from '@/domain/types';

/**
 * SCREEN CONTRACT — S-R-02 My Leads
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         see which of my leads needs me, and act on it
 * DOMINANT_ACTION     capture a new lead (header CTA, always reachable)
 * VISIBLE_COMPONENTS  AppBar, StatTile x4 (counts), GlobalSearch+sort,
 *                     EntityCard xN, AlertCard (tip), TabBar
 * WORKFLOW_STATE      mixed — the list spans all eight lifecycle states
 * CURRENT_GATE        none at list level; per-card actions carry their own
 * KEY_REQUIRED        none
 * DATA                counts(total,new,follow-up,won), lead records
 * INTERACTIONS        search, filter, sort, open lead, per-state action
 * FORBIDDEN_DATA      project value, quoted price, margin, customer phone
 * RESPONSIVE          <360 count strip scrolls horizontally; card rail stacks
 * IMPORTANT_STATES    empty list, offline, breached SLA on a card
 *
 * The per-card action is chosen by lifecycle state, not hard-coded per row:
 * a blocked lead offers recovery, a won lead offers tracking. This is the
 * NextAction contract applied at card scale.
 */
function actionFor(lead: RiderLead, t: (k: never) => string) {
  const T = t as unknown as (k: string) => string;
  switch (lead.status.state) {
    case 'selling':
      return { label: T('leads.call'), icon: 'phone' as const, tone: 'secondary' as const };
    case 'won':
      return { label: T('leads.viewStatus'), icon: 'arrow-right' as const, tone: 'primary' as const };
    case 'installing':
      return { label: T('leads.viewProgress'), icon: 'arrow-right' as const, tone: 'primary' as const };
    default:
      return { label: T('home.viewDetails'), icon: 'arrow-right' as const, tone: 'primary' as const };
  }
}

export function RiderLeads() {
  const { t } = useI18n();
  const nav = useNavigate();

  return (
    <Screen header={<AppBar notificationCount={3} />}>
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--aiec-space-6)', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 'var(--aiec-space-2)', minWidth: 0 }}>
            <h1
              className="aiec-no-clip"
              style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800, letterSpacing: '-0.01em' }}
            >
              {t('leads.title')}
            </h1>
            <p className="aiec-no-clip" style={{ fontSize: 13, lineHeight: '19px', color: 'var(--text-secondary)' }}>
              {t('leads.subtitle')}
            </p>
          </div>
          <button
            type="button"
            className="aiec-btn aiec-btn--primary aiec-btn--compact"
            onClick={() => nav('/capture')}
            style={{ borderRadius: 'var(--aiec-radius-pill)', whiteSpace: 'nowrap' }}
          >
            <Icon name="plus" size={17} />
            {t('leads.newCapture')}
          </button>
        </div>

        {/* Counts. Four equal columns, each a filter entry point. */}
        <div className="aiec-stats">
          <CountTile value={LEAD_STATS.total} label={t('leads.statTotal')} icon="list" tone="new" />
          <CountTile value={LEAD_STATS.fresh} label={t('leads.statNew')} icon="sparkle" tone="closed" />
          <CountTile value={LEAD_STATS.followUp} label={t('leads.statFollowUp')} icon="switch-camera" tone="selling" />
          <CountTile value={LEAD_STATS.won} label={t('leads.statWon')} icon="check-circle" tone="done" />
        </div>

        <GlobalSearch
          placeholder={t('leads.searchPlaceholder')}
          filterLabel={t('home.filter')}
          trailing={
            <>
              <button type="button" className="aiec-filterbtn">
                <Icon name="filter" size={16} />
                {t('home.filter')}
              </button>
              <button type="button" className="aiec-filterbtn">
                <Icon name="sort" size={16} />
                {t('leads.sortNewest')}
              </button>
            </>
          }
        />

        {/* Card list keeps its own rhythm: the reference runs a 9.5px gutter
            between cards, tighter than the section stack. */}
        <div style={{ display: 'grid', gap: 10 }}>
          {RIDER_LEADS.map((lead) => (
            <EntityCard
              key={lead.id}
              lead={lead}
              action={actionFor(lead, t as never)}
              earnMode={['won', 'installing', 'done'].includes(lead.status.state) ? 'earned' : 'potential'}
              onAction={() => nav(`/leads/${lead.id}`)}
              onOpen={() => nav(`/leads/${lead.id}`)}
            />
          ))}
        </div>

        <AlertCard title={t('leads.tip')} text={t('leads.tipBody')} icon="sparkle" tone="material" />
      </Stack>
    </Screen>
  );
}

function CountTile({
  value,
  label,
  icon,
  tone,
}: {
  value: number;
  label: string;
  icon: 'list' | 'sparkle' | 'switch-camera' | 'check-circle';
  tone: 'new' | 'closed' | 'selling' | 'done';
}) {
  return (
    <div className="aiec-stat" style={{ gap: 'var(--aiec-space-4)', padding: 'var(--aiec-space-4) var(--aiec-space-5)' }}>
      <span
        className="aiec-stat__icon"
        style={{
          background: `var(--aiec-lifecycle-${tone}-surface)`,
          color: `var(--aiec-lifecycle-${tone}-accent)`,
          width: 26,
          height: 26,
        }}
      >
        <Icon name={icon} size={14} />
      </span>
      <span className="aiec-stat__body">
        <span className="aiec-stat__value" style={{ fontSize: 18, lineHeight: '22px' }}>
          {value}
        </span>
        <span className="aiec-stat__label" style={{ fontSize: 10 }}>
          {label}
        </span>
      </span>
    </div>
  );
}
