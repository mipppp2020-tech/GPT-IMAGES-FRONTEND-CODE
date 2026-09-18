import { useNavigate, useParams } from 'react-router-dom';
import { Screen, Stack, SectionHeader } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon, type IconName } from '@/components/Icon';
import { WorkflowProgress } from '@/components/Workflow';
import { NextAction } from '@/components/NextAction';
import { StatusIndicator } from '@/components/StatusIndicator';
import { AlertCard } from '@/components/EntityCard';
import { SLAIndicator } from '@/components/Operational';
import { MapView } from '@/components/MapView';
import { useI18n, formatRupees, formatDistance } from '@/i18n';
import { RIDER_LEADS } from '@/data/fixtures';
import hero from '@/assets/hero-site.jpg';

/**
 * SCREEN CONTRACT — S-R-07 Lead detail
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         understand this lead's state and take the next action
 * DOMINANT_ACTION     take next action (bottom, with the earning in context)
 * VISIBLE_COMPONENTS  AppBar(contextual), hero, fact chips, StatusIndicator
 *                     (full five-slot), WorkflowProgress, AlertCard(AI),
 *                     contact rail, notes, MapView, NextAction
 * WORKFLOW_STATE      derived from the lead's lifecycle state
 * CURRENT_GATE        none for a new lead; later states gate on AIEC approval
 * KEY_REQUIRED        none
 * DATA                site facts, status grammar, contact, site notes, position
 * INTERACTIONS        call, message, follow up, directions, next action
 * FORBIDDEN_DATA      quoted price, margin, competitor quotes, raw phone number
 * RESPONSIVE          <360 fact chips wrap to two rows; contact rail stacks
 * IMPORTANT_STATES    blocked (recovery framing), breached SLA, offline
 *
 * The contact rail dials through a masked relay — the rider gets a call
 * button, never the customer's raw number (§10).
 */
export function RiderLeadDetail() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const { id } = useParams();
  const lead = RIDER_LEADS.find((l) => l.id === id) ?? RIDER_LEADS[0];
  const dist = formatDistance(lead.distanceM, lang);

  return (
    <Screen
      statusBarTime="9:20"
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar
            title={t('detail.back')}
            onBack={() => nav(-1)}
            actions={
              <>
                <button type="button" className="aiec-chip aiec-chip--interactive">
                  <Icon name="share" size={15} />
                  {t('detail.share')}
                </button>
                <button type="button" className="aiec-iconbtn" aria-label={t('detail.moreAction')}>
                  <Icon name="more" size={20} />
                </button>
              </>
            }
          />
        </>
      }
      nextAction={
        <NextAction
          label={t('detail.nextAction')}
          onPress={() => nav('/capture')}
          context={{
            label: t('detail.earnFromLead'),
            value: `${t('common.rupee')} ${formatRupees(lead.riderEarningPaise, lang)}`,
          }}
          contextLayout="inline"
        />
      }
    >
      <Stack gap="loose" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--aiec-space-6)', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 'var(--aiec-space-4)', minWidth: 0 }}>
            <h1 className="aiec-no-clip" style={{ fontSize: 24, lineHeight: '31px', fontWeight: 800 }}>
              {lead.siteName}
            </h1>
            <Fact icon="building" text={`${lead.locality} - ${lead.pincode}`} />
            <Fact icon="pin-filled" text={`${dist.value} ${t('detail.distanceAway')}`} />
            <Fact icon="calendar" text={`${t('detail.leadDate')}: 16 ऑग, 10:24 AM`} />
          </div>

          <figure style={{ position: 'relative', width: 148, flex: 'none' }}>
            <img
              src={hero}
              alt={lead.siteName}
              style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 'var(--aiec-radius-3)' }}
            />
            <figcaption
              style={{
                position: 'absolute',
                left: 6,
                bottom: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 999,
                background: 'rgba(14,17,22,0.66)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              <Icon name="image" size={11} />
              {t('detail.photosCount')} ({lead.photoCount})
            </figcaption>
          </figure>
        </div>

        {/* Three site facts. These are what decide whether a lift fits. */}
        <div className="aiec-stats">
          <FactTile icon="building" label={t('detail.buildingType')} value={t('detail.residential')} tone="done" />
          <FactTile icon="users" label={t('detail.floors')} value={lead.floors ?? '—'} tone="selling" />
          <FactTile icon="lift" label={t('detail.liftNeed')} value={lead.liftRequirement ?? '—'} tone="material" />
        </div>

        <section className="aiec-card" style={{ padding: 'var(--aiec-space-7)', display: 'grid', gap: 'var(--aiec-space-6)' }}>
          <SectionHeader
            title={t('detail.journeyTitle')}
            action={
              <button type="button" className="aiec-section__action">
                {t('detail.journeyAll')}
                <Icon name="chevron-right" size={15} />
              </button>
            }
          />
          <WorkflowProgress
            current={2}
            steps={[
              { label: t('lifecycle.new'), note: '16 ऑग' },
              { label: t('lifecycle.selling'), note: '18 ऑग' },
              { label: 'करार अपेक्षित' },
              { label: 'साईट पाहणी' },
              { label: `${t('leads.statWon')} (${t('common.rupee')})` },
            ]}
          />
          {/* The full five-slot status: state, reason, custody, clock, consequence. */}
          <StatusIndicator status={lead.status} variant="full" />
          <SLAIndicator clock={lead.status.clock} />
        </section>

        <AlertCard
          title={t('detail.aiTitle')}
          text={t('detail.aiBody')}
          icon="sparkle"
          tone="info"
          action={
            <button
              type="button"
              className="aiec-btn aiec-btn--secondary aiec-btn--compact"
              style={{ alignSelf: 'center', flex: 'none' }}
            >
              {t('detail.followUp')}
            </button>
          }
        />

        <section className="aiec-card" style={{ padding: 'var(--aiec-space-7)', display: 'grid', gap: 'var(--aiec-space-6)' }}>
          <h2 style={{ fontSize: 'var(--aiec-type-h3-size)', fontWeight: 700 }}>{t('detail.contactTitle')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--aiec-space-5)' }}>
            <span
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'var(--surface-sunken)',
                color: 'var(--icon-secondary)',
                display: 'grid',
                placeItems: 'center',
                flex: 'none',
              }}
            >
              <Icon name="phone" size={18} />
            </span>
            <span style={{ display: 'grid', gap: 1, minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }} className="aiec-no-clip">
                {lead.contact?.name ?? '—'}
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{lead.contact?.role ?? ''}</span>
            </span>
            <ContactAction icon="phone" label={t('detail.callAction')} tone="done" />
            <ContactAction icon="message" label={t('detail.messageAction')} tone="selling" />
            <ContactAction icon="more" label={t('detail.moreAction')} tone="new" />
          </div>
        </section>

        <section className="aiec-card" style={{ padding: 'var(--aiec-space-7)', display: 'grid', gap: 'var(--aiec-space-5)' }}>
          <h2 style={{ fontSize: 'var(--aiec-type-h3-size)', fontWeight: 700 }}>{t('detail.importantTitle')}</h2>
          <div style={{ display: 'flex', gap: 'var(--aiec-space-5)', alignItems: 'flex-start' }}>
            <Icon name="building" size={18} style={{ color: 'var(--icon-secondary)', flex: 'none', marginTop: 2 }} />
            <p className="aiec-no-clip" style={{ fontSize: 12.5, lineHeight: '18px', color: 'var(--text-secondary)' }}>
              {t('detail.importantBody')}
            </p>
            <Icon name="chevron-right" size={16} style={{ color: 'var(--icon-secondary)', flex: 'none' }} />
          </div>
        </section>

        <section style={{ display: 'grid', gap: 'var(--aiec-space-5)' }}>
          <SectionHeader
            title={t('detail.mapTitle')}
            action={
              <button type="button" className="aiec-section__action">
                <Icon name="navigation" size={15} />
                {t('detail.showDirection')}
              </button>
            }
          />
          <div style={{ borderRadius: 'var(--aiec-radius-3)', overflow: 'hidden' }}>
            <MapView
              variant="mini"
              points={[{ id: 'self', state: lead.status.state, x: 0.5, y: 0.52, label: lead.siteName }]}
              height={104}
            />
          </div>
        </section>
      </Stack>
    </Screen>
  );
}

function Fact({ icon, text }: { icon: IconName; text: string }) {
  return (
    <span className="aiec-entity__metaitem" style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
      <Icon name={icon} size={14} />
      <span className="aiec-no-clip">{text}</span>
    </span>
  );
}

function FactTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: IconName;
  label: string;
  value: string;
  tone: 'done' | 'selling' | 'material';
}) {
  return (
    <div
      className="aiec-stat"
      style={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--aiec-space-3)',
        background: `var(--aiec-lifecycle-${tone}-surface)`,
        border: 0,
        boxShadow: 'none',
      }}
    >
      <Icon name={icon} size={17} style={{ color: `var(--aiec-lifecycle-${tone}-accent)` }} />
      <span style={{ fontSize: 10, color: 'var(--text-secondary)' }} className="aiec-no-clip">
        {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700 }} className="aiec-no-clip">
        {value}
      </span>
    </div>
  );
}

function ContactAction({ icon, label, tone }: { icon: IconName; label: string; tone: 'done' | 'selling' | 'new' }) {
  return (
    <button
      type="button"
      className="aiec-iconbtn"
      aria-label={label}
      style={{
        flexDirection: 'column',
        gap: 2,
        minWidth: 52,
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--text-secondary)',
      }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: `var(--aiec-lifecycle-${tone}-surface)`,
          color: `var(--aiec-lifecycle-${tone}-accent)`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Icon name={icon} size={16} />
      </span>
      {label}
    </button>
  );
}
