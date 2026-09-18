import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon, type IconName } from '@/components/Icon';
import { EntityTimeline, Tabs } from '@/components/Records';
import { AlertCard, THUMBS } from '@/components/EntityCard';
import { NextAction } from '@/components/NextAction';
import { useI18n, formatRupees } from '@/i18n';
import { SITE_RECORDS } from '@/data/records';
import type { ActionState } from '@/domain/lifecycle';
import hero from '@/assets/hero-wide.jpg';
import e1 from '@/assets/evidence-1.jpg';
import e2 from '@/assets/evidence-2.jpg';
import e3 from '@/assets/evidence-3.jpg';
import e4 from '@/assets/evidence-4.jpg';

/**
 * SCREEN CONTRACT — S-R-09 Record detail
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         see the registered facts and what the record is waiting on
 * DOMINANT_ACTION     download the certificate — GATED on AIEC final review
 * VISIBLE_COMPONENTS  AppBar, ContextBar, fact chips, photo carousel, Tabs(5),
 *                     fact grid, AlertCard, EntityTimeline, NextAction
 * WORKFLOW_STATE      inspection complete, final review in progress
 * CURRENT_GATE        approval: AIEC final review
 * KEY_REQUIRED        AIEC verification sign-off
 * DATA                statutory facts, fee paid, next-step timeline
 * INTERACTIONS        switch tab, browse photos, edit record, share
 * FORBIDDEN_DATA      installation value, margin, owner commercials
 * RESPONSIVE          <360 the fact grid becomes one column
 * IMPORTANT_STATES    awaiting review (gated), certificate ready (open)
 *
 * The reference draws "प्रमाणपत्र डाउनलोड करा" as an enabled button while its
 * own timeline says the certificate only exists after verification. That is a
 * fake enabled action, which §12 forbids, so it is rendered as a KeyringGate
 * naming who must sign off and what happens next. See DEVIATIONS.md.
 */
export function RiderRecordDetail() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const { id } = useParams();
  const rec = SITE_RECORDS.find((r) => r.id === id) ?? SITE_RECORDS[0];
  const [tab, setTab] = useState('info');

  const certificateReady = false;
  const certAction: ActionState = certificateReady
    ? { kind: 'open' }
    : {
        kind: 'gated',
        gate: {
          reason: t('recdetail.step3Body'),
          unlockableBy: 'AIEC पडताळणी टीम',
          requirement: { kind: 'approval', label: t('recdetail.step2'), approver: 'AIEC टीम' },
          nextStep: 'पडताळणी पूर्ण होताच प्रमाणपत्र येथे डाउनलोडसाठी उपलब्ध होईल.',
        },
      };

  return (
    <Screen
      statusBarTime="9:20"
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar
            title={t('records.title')}
            onBack={() => nav('/records')}
            actions={
              <>
                <button type="button" className="aiec-chip aiec-chip--interactive">
                  <Icon name="share" size={15} />
                  {t('recdetail.share')}
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
          label={t('recdetail.downloadCert')}
          icon="upload"
          action={certAction}
          secondary={{ label: t('recdetail.editRecord'), icon: 'list' }}
        />
      }
    >
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-4)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
            {rec.siteName}
          </h1>
          <span className="aiec-entity__metaitem" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <Icon name="pin-filled" size={14} />
            {rec.locality} - {rec.pincode}
          </span>
          <div style={{ display: 'flex', gap: 'var(--aiec-space-5)', flexWrap: 'wrap' }}>
            <span className="aiec-chip" style={{ background: 'var(--aiec-lifecycle-done-surface)', color: 'var(--aiec-lifecycle-done-text)' }}>
              <Icon name="check-circle" size={13} />
              {t('records.stDone')}
            </span>
            <span className="aiec-chip">{rec.floorsFull}</span>
            <span className="aiec-chip" style={{ background: 'var(--aiec-lifecycle-won-surface)', color: 'var(--aiec-lifecycle-won-text)' }}>
              {t('recdetail.residential')}
            </span>
          </div>
        </div>

        {/* Photo carousel */}
        <figure style={{ position: 'relative', borderRadius: 'var(--aiec-radius-3)', overflow: 'hidden' }}>
          <img src={hero} alt={rec.siteName} style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover' }} />
          <span style={{ position: 'absolute', top: 10, insetInlineEnd: 10, padding: '3px 10px', borderRadius: 999, background: 'rgba(14,17,22,0.68)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
            1 / 5
          </span>
          <CarouselBtn side="start" />
          <CarouselBtn side="end" />
          <figcaption style={{ position: 'absolute', left: 10, bottom: 10, padding: '4px 10px', borderRadius: 6, background: 'rgba(14,17,22,0.68)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
            {t('recdetail.mainPhoto')}
          </figcaption>
        </figure>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 'var(--aiec-space-4)' }}>
          {[THUMBS[rec.thumbnailId], e1, e2, e3, e4].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{
                width: '100%',
                aspectRatio: '1',
                objectFit: 'cover',
                borderRadius: 'var(--aiec-radius-1)',
                outline: i === 0 ? '2px solid var(--aiec-lifecycle-selling-accent)' : 'none',
                outlineOffset: -2,
              }}
            />
          ))}
          <span style={{ display: 'grid', placeItems: 'center', gap: 2, aspectRatio: '1', borderRadius: 'var(--aiec-radius-1)', background: 'var(--surface-sunken)', color: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }}>
            <Icon name="image" size={15} />
            +1
          </span>
        </div>

        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: 'info', label: t('recdetail.tabInfo') },
            { id: 'progress', label: t('recdetail.tabProgress') },
            { id: 'photos', label: t('recdetail.tabPhotos') },
            { id: 'docs', label: t('recdetail.tabDocs') },
            { id: 'notes', label: t('recdetail.tabNotes') },
          ]}
        />

        {tab === 'info' ? (
          <>
            <section className="aiec-card" style={{ padding: 'var(--aiec-space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--aiec-space-5)' }}>
              <Fact icon="building" k={t('recdetail.buildingName')} v={rec.siteName} />
              <Fact icon="building" k={t('recdetail.approvedFloors')} v={rec.floorsFull} />
              <Fact icon="pin-filled" k={t('recdetail.address')} v={`${rec.locality} - ${rec.pincode}`} />
              <Fact icon="user" k={t('recdetail.ownerName')} v={rec.ownerName} />
              <Fact icon="users" k={t('recdetail.type')} v={t('recdetail.residential')} />
              <Fact icon="list" k={t('recdetail.recordNo')} v={rec.reference} />
              <Fact icon="calendar" k={t('recdetail.recordDate')} v={rec.recordedAt} />
              <Fact
                icon="rupee"
                k={t('recdetail.feePaid')}
                v={`${t('common.rupee')} ${formatRupees(rec.feePaidPaise, lang)}`}
                chip={t('recdetail.successChip')}
              />
            </section>

            <AlertCard title={t('recdetail.inspectedTitle')} text={t('recdetail.inspectedBody')} icon="check-circle" tone="done" />

            <h2 style={{ fontSize: 'var(--aiec-type-h2-size)', fontWeight: 700, marginTop: 'var(--aiec-space-4)' }}>
              {t('recdetail.nextSteps')}
            </h2>
            <EntityTimeline
              entries={[
                { id: 't1', state: 'done', title: t('recdetail.step1'), note: '16 ऑग, 2025' },
                {
                  id: 't2',
                  state: 'running',
                  title: t('recdetail.step2'),
                  note: t('recdetail.step2Body'),
                  chip: { label: t('recdetail.step2Chip'), tone: 'material' },
                },
                { id: 't3', state: 'pending', title: t('recdetail.step3'), note: t('recdetail.step3Body') },
              ]}
            />
          </>
        ) : (
          <AlertCard
            title={t('recdetail.tabProgress')}
            text="हा टॅब पुढील ट्रँचमध्ये येईल."
            icon="info"
            tone="new"
          />
        )}
      </Stack>
    </Screen>
  );
}

function CarouselBtn({ side }: { side: 'start' | 'end' }) {
  return (
    <button
      type="button"
      className="aiec-iconbtn"
      aria-label={side}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [side === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: 8,
        /* The reference draws these at ~36px. Source §9 sets a 48px floor
           for action controls and outranks reference geometry, so they are
           built at 48. Documented in DEVIATIONS.md. */
        width: 48,
        height: 48,
        minWidth: 48,
        minHeight: 48,
        borderRadius: '50%',
        background: 'rgba(28,33,41,0.78)',
        color: '#fff',
      }}
    >
      <Icon name={side === 'start' ? 'chevron-left' : 'chevron-right'} size={18} />
    </button>
  );
}

function Fact({ icon, k, v, chip }: { icon: IconName; k: string; v: string; chip?: string }) {
  return (
    <span style={{ display: 'flex', gap: 'var(--aiec-space-4)', alignItems: 'flex-start', minWidth: 0 }}>
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 'var(--aiec-radius-2)',
          background: 'var(--surface-sunken)',
          color: 'var(--icon-primary)',
          display: 'grid',
          placeItems: 'center',
          flex: 'none',
        }}
      >
        <Icon name={icon} size={15} />
      </span>
      <span style={{ display: 'grid', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 10.5, color: 'var(--text-secondary)' }} className="aiec-no-clip">
          {k}
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 700 }} className="aiec-no-clip">
          {v}
        </span>
        {chip ? (
          <span
            className="aiec-chip"
            style={{
              background: 'var(--aiec-lifecycle-done-surface)',
              color: 'var(--aiec-lifecycle-done-text)',
              justifySelf: 'start',
              marginTop: 2,
            }}
          >
            {chip}
          </span>
        ) : null}
      </span>
    </span>
  );
}
