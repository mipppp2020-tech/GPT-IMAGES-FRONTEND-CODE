import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { WorkflowProgress } from '@/components/Workflow';
import { ScreenHelp } from '@/components/Operational';
import { AlertCard } from '@/components/EntityCard';
import { useI18n, formatRupees } from '@/i18n';
import { useRider, RIDER_RATES, type CapturedPhoto } from '@/app/RiderContext';
import type { StringKey } from '@/i18n/strings';
import feed from '@/assets/camera-frame.jpg';
import e1 from '@/assets/evidence-1.jpg';
import e2 from '@/assets/evidence-2.jpg';
import e3 from '@/assets/evidence-3.jpg';

/**
 * SCREEN CONTRACT — R2 Capture (PRD §8.1)
 *
 * ROLE                rider
 * THEME               sunlight chrome, slate viewfinder
 * PRIMARY_JOB         photograph a shaft so it becomes a paid lead
 * DOMINANT_ACTION     the shutter (72dp), then Submit
 * TIME BUDGET         11s design target, 15s failure (UX Arch §9)
 * CURRENT_GATE        none — this step CREATES the evidence other gates read
 * DATA                three photos, GPS fix, the per-lead rate
 * FORBIDDEN_DATA      any customer or commercial field
 * IMPORTANT_STATES    GPS unavailable · duplicate within 50m · low quality ·
 *                     offline (queued locally, wallet shows "sending")
 *
 * Three shots in a fixed order — shaft, building, board — because the sales
 * scorer reads them positionally. Submit runs the real transaction through
 * the rider session: the 50m duplicate check, the quality split, a Damm-checked
 * LEAD id, and the wallet credit. Nothing here is staged; the outcome that
 * comes back is what the rest of the app then shows.
 */
const SHOTS: { kind: CapturedPhoto['kind']; src: string; label: StringKey; hint: StringKey }[] = [
  { kind: 'shaft', src: e1, label: 'cap.shaft', hint: 'cap.shaftHint' },
  { kind: 'building', src: e2, label: 'cap.building', hint: 'cap.buildingHint' },
  { kind: 'contact', src: e3, label: 'cap.contact', hint: 'cap.contactHint' },
];

export function RiderCapture() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const {
    draft, takePhoto, submitCapture, gpsAvailable, setGps, online, setOnline,
    rideStarted, startRide, lastOutcome,
  } = useRider();
  const [lowQualityOffer, setLowQualityOffer] = useState(false);

  const next = SHOTS.find((s) => !draft.some((d) => d.kind === s.kind));
  const allTaken = !next;
  const money = (p: number) => `${t('common.rupee')} ${formatRupees(p, lang)}`;

  const shoot = () => {
    if (next) takePhoto(next.kind, next.src);
  };

  const submit = (opts: { forceDuplicate?: boolean; lowQuality?: boolean } = {}) => {
    const out = submitCapture(opts);
    if (out.kind === 'captured') {
      // A low-quality capture still pays, but the rider is offered the retake
      // before they leave the screen (PRD §8.2).
      if (out.lowQuality) setLowQualityOffer(true);
      else nav('/success');
    }
  };

  return (
    <Screen
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar title={t('chrome.back')} onBack={() => nav(-1)} actions={<ScreenHelp />} />
        </>
      }
      nextAction={
        <div className="aiec-nextaction">
          {!allTaken ? (
            <span className="aiec-nextaction__ctxlabel aiec-no-clip" style={{ textAlign: 'center' }}>
              {t('cap.needPhotos')}
            </span>
          ) : null}
          <button
            type="button"
            className="aiec-btn aiec-btn--primary aiec-btn--block"
            onClick={() => (allTaken ? submit() : shoot())}
          >
            {allTaken
              ? t('cap.submitAnd', { amount: formatRupees(RIDER_RATES.validLead, lang) })
              : t('capture.shutter')}
            <Icon name={allTaken ? 'arrow-right' : 'camera'} size={20} />
          </button>
        </div>
      }
    >
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--aiec-space-6)', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 'var(--aiec-space-2)', minWidth: 0 }}>
            <h1 className="aiec-no-clip" style={{ fontSize: 24, lineHeight: '31px', fontWeight: 800 }}>
              {t('capture.title')}
            </h1>
            <p className="aiec-no-clip" style={{ fontSize: 13, lineHeight: '19px', color: 'var(--text-secondary)' }}>
              {t('capture.subtitle')}
            </p>
          </div>
          <div
            style={{
              display: 'grid', gap: 2,
              padding: 'var(--aiec-space-5) var(--aiec-space-6)',
              borderRadius: 'var(--aiec-radius-3)',
              background: 'var(--surface-primary-weak)',
              textAlign: 'center', minWidth: 112,
            }}
          >
            <span style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>{t('capture.perLead')}</span>
            <span style={{ fontFamily: 'var(--aiec-font-num)', fontSize: 20, lineHeight: '25px', fontWeight: 800, color: 'var(--text-accent)' }}>
              {money(RIDER_RATES.validLead)}
            </span>
            <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{t('capture.perLeadHint')}</span>
          </div>
        </div>

        <WorkflowProgress
          tone="accent"
          current={draft.length}
          steps={[
            ...SHOTS.map((s) => ({ label: t(s.label) })),
            { label: t('capture.step4') },
          ]}
        />

        {!rideStarted ? (
          <button type="button" style={{ all: 'unset', cursor: 'pointer', display: 'block' }} onClick={startRide}>
            <AlertCard title={t('ride.startFirst')} text={t('ride.start')} icon="navigation" tone="material" />
          </button>
        ) : null}
      </Stack>

      {/* Evidence surface. There is no gallery-import path here, by design. */}
      <div className="aiec-viewfinder" data-aiec-theme="slate" style={{ aspectRatio: '430 / 368' }}>
        <img className="aiec-viewfinder__feed" src={next ? feed : draft[draft.length - 1].src} alt="" />
        <div className="aiec-vframe"><span /><span /><span /><span /></div>
        <div className="aiec-viewfinder__overlay">
          <div className="aiec-viewfinder__row">
            <span className="aiec-vpill" style={gpsAvailable ? undefined : { background: 'rgba(196, 43, 28, 0.85)' }}>
              <Icon name={gpsAvailable ? 'pin-filled' : 'cloud-off'} size={15} />
              <span>
                {gpsAvailable ? t('capture.locationOn') : t('cap.gpsTitle')}
                <span className="aiec-vpill__sub">
                  {gpsAvailable ? t('capture.accuracy') : t('cap.gpsBody')}
                </span>
              </span>
            </span>
            <span className="aiec-vpill">
              {t('cap.step', { n: Math.min(draft.length + 1, SHOTS.length), total: SHOTS.length })}
            </span>
          </div>
          <div className="aiec-vcaption">
            <b>{next ? t(next.label) : t('cap.taken')}</b>
            <span>{next ? t(next.hint) : t('cap.submit')}</span>
          </div>
        </div>
      </div>

      <div className="aiec-capturedeck">
        <span className="aiec-capturedeck__aux">
          <span className="aiec-capturedeck__auxicon"><Icon name="gallery-off" size={17} /></span>
          <span>
            <b className="aiec-no-clip">{t('capture.galleryOff')}</b>
            {t('capture.galleryHint')}
          </span>
        </span>
        <button
          type="button"
          className="aiec-shutter"
          aria-label={t('capture.shutter')}
          onClick={shoot}
          style={allTaken ? { opacity: 0.45 } : undefined}
        />
        <span className="aiec-capturedeck__aux aiec-capturedeck__aux--end">
          <span>
            <b className="aiec-no-clip">{t('capture.switchCamera')}</b>
            {t('capture.switchHint')}
          </span>
          <span className="aiec-capturedeck__auxicon"><Icon name="switch-camera" size={17} /></span>
        </span>
      </div>

      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-8)' }}>
        {/* What has been shot so far, in the order the scorer expects. */}
        <div className="aiec-photogrid">
          {SHOTS.map((s) => {
            const shot = draft.find((d) => d.kind === s.kind);
            return shot ? (
              <figure key={s.kind} className="aiec-photo">
                <img src={shot.src} alt={t(s.label)} />
                <figcaption className="aiec-photo__caption aiec-no-clip">{t(s.label)}</figcaption>
              </figure>
            ) : (
              <span key={s.kind} className="aiec-photo aiec-photo--add">
                <Icon name="camera" size={20} />
                {t(s.label)}
              </span>
            );
          })}
        </div>

        {/* §8.3 failure table — shown inline and persistent, never a toast. */}
        {lastOutcome?.kind === 'duplicate' ? (
          <AlertCard
            title={t('cap.dupTitle')}
            text={t('cap.dupBody', { by: lastOutcome.by, on: lastOutcome.on })}
            icon="lock"
            tone="blocked"
            action={
              <button
                type="button"
                className="aiec-btn aiec-btn--secondary aiec-btn--compact"
                style={{ alignSelf: 'center', flex: 'none' }}
                onClick={() => nav('/')}
              >
                {t('cap.dupAction')}
              </button>
            }
          />
        ) : null}

        {lastOutcome?.kind === 'blocked' && lastOutcome.because === 'gps' ? (
          <AlertCard title={t('cap.gpsTitle')} text={t('cap.gpsBody')} icon="alert" tone="blocked" />
        ) : null}

        {lowQualityOffer ? (
          <AlertCard
            title={t('cap.lowQuality', {
              low: formatRupees(RIDER_RATES.lowQualityLead, lang),
              full: formatRupees(RIDER_RATES.validLead, lang),
            })}
            icon="camera"
            tone="material"
            action={
              <button
                type="button"
                className="aiec-btn aiec-btn--primary aiec-btn--compact"
                style={{ alignSelf: 'center', flex: 'none' }}
                onClick={() => { setLowQualityOffer(false); nav('/success'); }}
              >
                {t('cap.keepLow', { low: formatRupees(RIDER_RATES.lowQualityLead, lang) })}
              </button>
            }
          />
        ) : null}

        {/* Exercising the failure paths without standing at a real site. */}
        <div className="aiec-tips">
          <span className="aiec-tips__title">
            <Icon name="sparkle" size={16} style={{ color: 'var(--accent-primary)' }} />
            {t('cap.simulate')}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--aiec-space-4)' }}>
            <button type="button" className="aiec-doc__action" onClick={() => submit({ forceDuplicate: true })}>
              {t('cap.simDup')}
            </button>
            <button type="button" className="aiec-doc__action" onClick={() => submit({ lowQuality: true })}>
              {t('cap.simLow')}
            </button>
            <button type="button" className="aiec-doc__action" onClick={() => setGps(!gpsAvailable)}>
              {gpsAvailable ? t('cap.simGps') : t('cap.simGpsOn')}
            </button>
            <button type="button" className="aiec-doc__action" onClick={() => setOnline(!online)}>
              {online ? t('cap.simOffline') : t('cap.simOnline')}
            </button>
          </div>
        </div>
      </Stack>
    </Screen>
  );
}
