import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { EntityCard, AlertCard } from '@/components/EntityCard';
import { GlobalSearch } from '@/components/Operational';
import { useI18n } from '@/i18n';
import { LEAD_STATS } from '@/data/fixtures';
import { useRider } from '@/app/RiderContext';
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

type SortKey = 'newest' | 'nearest' | 'earning';
type FilterKey = 'all' | 'new' | 'followUp' | 'won';

export function RiderLeads() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { leads } = useRider();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('newest');

  /**
   * The count tiles are the filter. Tapping one narrows the list rather than
   * decorating it — a number you cannot act on is a number worth removing.
   */
  const rows = useMemo(() => {
    const byFilter = leads.filter((l) => {
      if (filter === 'all') return true;
      if (filter === 'new') return l.status.state === 'new';
      if (filter === 'followUp') return l.status.state === 'selling';
      return ['won', 'installing', 'material', 'done'].includes(l.status.state);
    });
    const sorted = [...byFilter];
    if (sort === 'nearest') sorted.sort((a, b) => a.distanceM - b.distanceM);
    if (sort === 'earning') sorted.sort((a, b) => b.riderEarningPaise - a.riderEarningPaise);
    return sorted;
  }, [leads, filter, sort]);

  const SORT_LABEL: Record<SortKey, string> = {
    newest: t('leads.sortNewest'),
    nearest: t('leads.sortNearest'),
    earning: t('leads.sortEarning'),
  };
  const cycleSort = () =>
    setSort((s) => (s === 'newest' ? 'nearest' : s === 'nearest' ? 'earning' : 'newest'));

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
          <CountTile value={leads.length} label={t('leads.statTotal')} icon="list" tone="new"
            on={filter === 'all'} onPress={() => setFilter('all')} />
          <CountTile value={leads.filter((l) => l.status.state === 'new').length} label={t('leads.statNew')} icon="sparkle" tone="closed"
            on={filter === 'new'} onPress={() => setFilter('new')} />
          <CountTile value={leads.filter((l) => l.status.state === 'selling').length} label={t('leads.statFollowUp')} icon="switch-camera" tone="selling"
            on={filter === 'followUp'} onPress={() => setFilter('followUp')} />
          <CountTile value={LEAD_STATS.won} label={t('leads.statWon')} icon="check-circle" tone="done"
            on={filter === 'won'} onPress={() => setFilter('won')} />
        </div>

        <GlobalSearch
          placeholder={t('leads.searchPlaceholder')}
          filterLabel={t('home.filter')}
          trailing={
            <>
              <button
                type="button"
                className="aiec-filterbtn"
                onClick={() => setFilter((f) => (f === 'all' ? 'new' : 'all'))}
              >
                <Icon name="filter" size={16} />
                {filter === 'all' ? t('home.filter') : t('leads.filterOn')}
              </button>
              <button type="button" className="aiec-filterbtn" onClick={cycleSort}>
                <Icon name="sort" size={16} />
                {SORT_LABEL[sort]}
              </button>
            </>
          }
        />

        {/* Card list keeps its own rhythm: the reference runs a 9.5px gutter
            between cards, tighter than the section stack. */}
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((lead) => (
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

        {rows.length === 0 ? (
          <AlertCard title={t('leads.empty')} text={t('leads.emptyBody')} icon="sparkle" tone="new" />
        ) : (
          <AlertCard title={t('leads.tip')} text={t('leads.tipBody')} icon="sparkle" tone="material" />
        )}
      </Stack>
    </Screen>
  );
}

function CountTile({
  value,
  label,
  icon,
  tone,
  on = false,
  onPress,
}: {
  value: number;
  label: string;
  icon: 'list' | 'sparkle' | 'switch-camera' | 'check-circle';
  tone: 'new' | 'closed' | 'selling' | 'done';
  on?: boolean;
  onPress?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-pressed={on}
      className="aiec-stat"
      style={{
        gap: 'var(--aiec-space-4)',
        padding: 'var(--aiec-space-4) var(--aiec-space-5)',
        borderColor: on ? 'var(--border-primary)' : undefined,
        borderWidth: on ? 'var(--aiec-border-emphasis)' : undefined,
        background: on ? 'var(--surface-primary-weak)' : undefined,
      }}
    >
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
    </button>
  );
}
