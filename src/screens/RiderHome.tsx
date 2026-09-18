import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Stack, SectionHeader } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { EntityCard, StatTile } from '@/components/EntityCard';
import { MapView } from '@/components/MapView';
import { GlobalSearch, SafetyOverride, OfflineQueue } from '@/components/Operational';
import { useI18n, formatRupees } from '@/i18n';
import { useApp } from '@/app/AppContext';
import { EARNINGS, MAP_POINTS, NEARBY_LEADS, OFFLINE_ITEMS, SELF_POSITION } from '@/data/fixtures';
import { LIFECYCLE_STATES, type LifecycleState } from '@/domain/lifecycle';

/**
 * SCREEN CONTRACT — S-R-01 Rider Home
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         decide where to ride next
 * DOMINANT_ACTION     capture the nearest new lead
 * VISIBLE_COMPONENTS  AppBar, StatTile x3, GlobalSearch, MapView(+MapEntity,
 *                     MapFilter), EntityCard x3, SafetyOverride, OfflineQueue,
 *                     TabBar
 * WORKFLOW_STATE      none — this is the dispatch surface
 * CURRENT_GATE        none
 * KEY_REQUIRED        none
 * DATA                earnings(today, week), appointments, nearby count,
 *                     nearby leads, map points, rider position
 * INTERACTIONS        pan/filter map, search, open lead, start capture
 * FORBIDDEN_DATA      project value, quoted price, margin, customer phone,
 *                     any owner cash position
 * RESPONSIVE          <360 stats wrap to 2+1; 835+ frame is pinned, map keeps
 *                     its aspect rather than stretching
 * IMPORTANT_STATES    offline (queue visible, map still readable from cache)
 */
export function RiderHome() {
  const { t, lang } = useI18n();
  const { online } = useApp();
  const nav = useNavigate();
  const [active, setActive] = useState<Set<LifecycleState>>(new Set(LIFECYCLE_STATES));

  const toggle = (s: LifecycleState) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <Screen header={<AppBar notificationCount={3} />}>
      <Stack gap="loose" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        {/* Hero: the day's framing plus the one number a rider checks first. */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--aiec-space-6)', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 'var(--aiec-space-3)', minWidth: 0 }}>
            <h1
              className="aiec-no-clip"
              style={{ fontSize: 22, lineHeight: '29px', fontWeight: 800, letterSpacing: '-0.01em' }}
            >
              {t('home.title')}
            </h1>
            <p className="aiec-no-clip" style={{ fontSize: 13, lineHeight: '19px', color: 'var(--text-secondary)' }}>
              {t('home.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => nav('/earnings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--aiec-space-5)',
              padding: 'var(--aiec-space-5) var(--aiec-space-6)',
              borderRadius: 'var(--aiec-radius-3)',
              background: 'var(--surface-primary-weak)',
              minWidth: 150,
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(254,91,1,0.16)',
                color: 'var(--accent-primary)',
                display: 'grid',
                placeItems: 'center',
                flex: 'none',
              }}
            >
              <Icon name="rupee" size={19} />
            </span>
            <span style={{ display: 'grid', gap: 1, textAlign: 'start' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('home.earningsToday')}</span>
              <span
                style={{
                  fontFamily: 'var(--aiec-font-num)',
                  fontSize: 21,
                  lineHeight: '26px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                {t('common.rupee')} {formatRupees(EARNINGS.todayPaise, lang)}
              </span>
            </span>
            <Icon name="chevron-right" size={16} style={{ color: 'var(--icon-secondary)', flex: 'none' }} />
          </button>
        </div>

        {/* Three KPIs. Rider-scoped only: no owner cash position appears here. */}
        <div className="aiec-stats">
          <StatTile
            value={String(EARNINGS.appointmentsToday)}
            label={t('home.statAppointments')}
            icon="target"
            tone="neutral"
          />
          <StatTile value={String(EARNINGS.nearbyLeads)} label={t('home.statNearby')} icon="pin-filled" tone="success" />
          <StatTile
            value={`${t('common.rupee')}${formatRupees(EARNINGS.weekPaise, lang)}`}
            label={t('home.statWeek')}
            icon="bars"
            tone="info"
          />
        </div>

        {!online ? <OfflineQueue items={OFFLINE_ITEMS} /> : null}

        <GlobalSearch placeholder={t('home.searchPlaceholder')} filterLabel={t('home.filter')} />
      </Stack>

      {/* Map is full-bleed: it is the screen's primary decision surface. */}
      <div style={{ marginBlock: 'var(--aiec-space-8)' }}>
        <MapView
          points={MAP_POINTS}
          self={SELF_POSITION}
          height={300}
          activeStates={active}
          onToggleState={toggle}
        />
      </div>

      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <SectionHeader
          title={t('home.nearbyTitle')}
          action={
            <button type="button" className="aiec-section__action" onClick={() => nav('/leads')}>
              {t('home.seeAll')}
              <Icon name="chevron-right" size={15} />
            </button>
          }
        />

        <EntityCard
          lead={NEARBY_LEADS[0]}
          variant="nearby"
          action={{ label: t('home.captureLead'), icon: 'arrow-right' }}
          onAction={() => nav('/capture')}
          onOpen={() => nav('/leads/l1')}
        />
        <EntityCard
          lead={NEARBY_LEADS[1]}
          variant="nearby"
          action={{ label: t('home.viewDetails'), icon: 'arrow-right' }}
          onAction={() => nav('/leads/l2')}
          onOpen={() => nav('/leads/l2')}
        />
        <EntityCard
          lead={NEARBY_LEADS[2]}
          variant="nearby"
          action={{ label: t('home.showRoute'), icon: 'navigation' }}
          onAction={() => nav('/leads/l3')}
          onOpen={() => nav('/leads/l3')}
        />

        <SafetyOverride />
      </Stack>
    </Screen>
  );
}
