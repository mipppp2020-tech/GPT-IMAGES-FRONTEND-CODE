import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { Segments } from '@/components/Records';
import { StatusIndicator } from '@/components/StatusIndicator';
import { THUMBS } from '@/components/EntityCard';
import { useI18n } from '@/i18n';
import { RECORD_COUNTS, SITE_RECORDS } from '@/data/records';
import type { SiteRecord } from '@/domain/types';
import type { LifecycleState } from '@/domain/lifecycle';
import type { IconName } from '@/components/Icon';

/** The record list marks state with a glyph, as the reference does. */
const STATE_ICON: Partial<Record<LifecycleState, IconName>> = {
  done: 'check-circle',
  selling: 'clock',
  installing: 'clock',
  material: 'clock',
  won: 'clock',
  closed: 'close',
  blocked: 'alert',
};

/**
 * SCREEN CONTRACT — S-R-08 My records
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         find the site record that needs attention
 * DOMINANT_ACTION     add a new lead
 * VISIBLE_COMPONENTS  AppBar, Segments(4), record cards, total banner, TabBar
 * WORKFLOW_STATE      mixed
 * CURRENT_GATE        none
 * KEY_REQUIRED        none
 * DATA                record list + per-state counts
 * INTERACTIONS        filter, search, open record, add lead
 * FORBIDDEN_DATA      installation value, margin, owner commercials
 * RESPONSIVE          <360 segments scroll horizontally; card meta stacks
 * IMPORTANT_STATES    empty filter result, offline
 */
export function RiderRecords() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [filter, setFilter] = useState('all');

  const rows = useMemo(() => {
    if (filter === 'all') return SITE_RECORDS;
    const want: Record<string, SiteRecord['status']['state'][]> = {
      active: ['selling', 'installing', 'material', 'won'],
      done: ['done'],
      cancelled: ['closed', 'blocked'],
    };
    return SITE_RECORDS.filter((r) => want[filter]?.includes(r.status.state));
  }, [filter]);

  return (
    <Screen statusBarTime="9:20" header={<AppBar notificationCount={3} />}>
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 'var(--aiec-space-5)', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 'var(--aiec-space-2)', minWidth: 0 }}>
            <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
              {t('records.title')}
            </h1>
            <p className="aiec-no-clip" style={{ fontSize: 13, lineHeight: '19px', color: 'var(--text-secondary)' }}>
              {t('records.subtitle')}
            </p>
          </div>
          <button type="button" className="aiec-iconbtn" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--aiec-radius-2)', background: 'var(--surface-raised)', width: 48, minWidth: 48 }} aria-label={t('chrome.search')}>
            <Icon name="search" size={19} />
          </button>
          <button type="button" className="aiec-filterbtn">
            <Icon name="filter" size={16} />
            {t('records.filter')}
          </button>
        </div>

        <Segments
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'all', label: t('records.tabAll'), count: RECORD_COUNTS.all },
            { id: 'active', label: t('records.tabActive'), count: RECORD_COUNTS.active },
            { id: 'done', label: t('records.tabDone'), count: RECORD_COUNTS.done },
            { id: 'cancelled', label: t('records.tabCancelled'), count: RECORD_COUNTS.cancelled },
          ]}
        />

        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((r) => (
            <RecordCard key={r.id} record={r} onOpen={() => nav(`/records/${r.id}`)} />
          ))}
        </div>

        <div className="aiec-alert" style={{ alignItems: 'center' }}>
          <span className="aiec-alert__icon">
            <Icon name="info" size={17} />
          </span>
          <div className="aiec-alert__body">
            <span className="aiec-alert__title aiec-no-clip">
              {t('records.totalTitle', { count: RECORD_COUNTS.all })}
            </span>
            <span className="aiec-alert__text aiec-no-clip">{t('records.totalBody')}</span>
          </div>
          <button
            type="button"
            className="aiec-btn aiec-btn--compact"
            style={{
              background: 'var(--aiec-lifecycle-selling-accent)',
              color: '#fff',
              flex: 'none',
              alignSelf: 'center',
            }}
            onClick={() => nav('/capture')}
          >
            <Icon name="plus" size={17} />
            {t('records.addNew')}
          </button>
        </div>
      </Stack>
    </Screen>
  );
}

/** The record card. Distinct from EntityCard: a record is a registered site
 *  with statutory facts, not a lead with an earning attached. */
function RecordCard({ record, onOpen }: { record: SiteRecord; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <article className="aiec-card">
      <div className="aiec-entity" style={{ gridTemplateColumns: '78px minmax(0,1fr) auto' }}>
        <img className="aiec-entity__thumb" src={THUMBS[record.thumbnailId]} alt="" />
        <div className="aiec-entity__body" style={{ gap: 'var(--aiec-space-2)' }}>
          <button type="button" onClick={onOpen} className="aiec-entity__title aiec-inline-target aiec-no-clip" style={{ textAlign: 'start' }}>
            {record.siteName}
          </button>
          <span className="aiec-entity__metaitem aiec-entity__sub" style={{ fontSize: 12 }}>
            <Icon name="pin-filled" size={12} />
            {record.locality} - {record.pincode}
          </span>
          <span className="aiec-entity__metaitem" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            <Icon name="calendar" size={12} stroke={1.8} />
            {record.recordedAt}
          </span>
          <span className="aiec-entity__metaitem" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            <Icon name="users" size={12} />
            {record.floors} ({record.flats} फ़्लॅट)
          </span>
        </div>
        <div className="aiec-entity__rail">
          <StatusIndicator status={record.status} icon={STATE_ICON[record.status.state] ?? 'clock'} />
          <button type="button" className="aiec-btn aiec-btn--secondary aiec-btn--compact aiec-entity__cta" onClick={onOpen}>
            {t('records.viewDetails')}
            <Icon name="chevron-right" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
