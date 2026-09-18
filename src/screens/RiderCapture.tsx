import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { WorkflowProgress } from '@/components/Workflow';
import { ScreenHelp } from '@/components/Operational';
import { useI18n, formatRupees } from '@/i18n';
import feed from '@/assets/camera-frame.jpg';

/**
 * SCREEN CONTRACT — S-R-03 Capture, step 1 (evidence)
 *
 * ROLE                rider
 * THEME               slate for the viewfinder, sunlight for page chrome
 * VIEWPORT            430x932
 * PRIMARY_JOB         photograph the building so the lead can be verified
 * DOMINANT_ACTION     the shutter (72dp, centred, bottom third)
 * VISIBLE_COMPONENTS  AppBar(contextual)+ScreenHelp, WorkflowProgress(4),
 *                     viewfinder(+GPS/flash pills, framing guide),
 *                     capture deck, tips, TabBar
 * WORKFLOW_STATE      step 1 of 4
 * CURRENT_GATE        none — this step CREATES the evidence other steps gate on
 * KEY_REQUIRED        camera + location permission
 * DATA                live feed, GPS accuracy, per-lead earning
 * INTERACTIONS        shoot, switch camera, toggle flash
 * FORBIDDEN_DATA      any customer or commercial field
 * RESPONSIVE          <360 tips stack to one column; viewfinder keeps 4:3
 * IMPORTANT_STATES    GPS weak, flash off, gallery deliberately unavailable
 *
 * Gallery import is disabled by design: an evidence photo must be taken at
 * the site, with a live GPS fix. The control states that rather than hiding.
 */
export function RiderCapture() {
  const { t, lang } = useI18n();
  const nav = useNavigate();

  return (
    <Screen
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar title={t('chrome.back')} onBack={() => nav(-1)} actions={<ScreenHelp />} />
        </>
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
              display: 'grid',
              gap: 2,
              padding: 'var(--aiec-space-5) var(--aiec-space-6)',
              borderRadius: 'var(--aiec-radius-3)',
              background: 'var(--surface-primary-weak)',
              textAlign: 'center',
              minWidth: 112,
            }}
          >
            <span style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>{t('capture.perLead')}</span>
            <span
              style={{
                fontFamily: 'var(--aiec-font-num)',
                fontSize: 20,
                lineHeight: '25px',
                fontWeight: 800,
                color: 'var(--text-accent)',
              }}
            >
              {t('common.rupee')} {formatRupees(4000, lang)}
            </span>
            <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{t('capture.perLeadHint')}</span>
          </div>
        </div>

        <WorkflowProgress
          tone="accent"
          current={0}
          steps={[
            { label: t('capture.step1') },
            { label: t('capture.step2') },
            { label: t('capture.step3') },
            { label: t('capture.step4') },
          ]}
        />
      </Stack>

      {/* Evidence surface — slate. Full bleed, 4:3, chrome floats over it. */}
      <div className="aiec-viewfinder" data-aiec-theme="slate" style={{ aspectRatio: '430 / 368' }}>
        <img className="aiec-viewfinder__feed" src={feed} alt="" />
        <div className="aiec-vframe">
          <span /><span /><span /><span />
        </div>
        <div className="aiec-viewfinder__overlay">
          <div className="aiec-viewfinder__row">
            <span className="aiec-vpill">
              <Icon name="pin-filled" size={15} />
              <span>
                {t('capture.locationOn')}
                <span className="aiec-vpill__sub">{t('capture.accuracy')}</span>
              </span>
            </span>
            <button type="button" className="aiec-vpill">
              <Icon name="flash-off" size={15} />
              {t('capture.flashOff')}
            </button>
          </div>
          <div className="aiec-vcaption">
            <b>{t('capture.frameTitle')}</b>
            <span>{t('capture.frameBody')}</span>
          </div>
        </div>
      </div>

      {/* Capture deck. Shutter is the dominant action and sits at 72dp. */}
      <div className="aiec-capturedeck">
        <span className="aiec-capturedeck__aux">
          <span className="aiec-capturedeck__auxicon">
            <Icon name="gallery-off" size={17} />
          </span>
          <span>
            <b className="aiec-no-clip">{t('capture.galleryOff')}</b>
            {t('capture.galleryHint')}
          </span>
        </span>

        <button type="button" className="aiec-shutter" aria-label={t('capture.shutter')} onClick={() => nav('/photos')} />

        <span className="aiec-capturedeck__aux aiec-capturedeck__aux--end">
          <span>
            <b className="aiec-no-clip">{t('capture.switchCamera')}</b>
            {t('capture.switchHint')}
          </span>
          <span className="aiec-capturedeck__auxicon">
            <Icon name="switch-camera" size={17} />
          </span>
        </span>
      </div>

      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-8)' }}>
        <div className="aiec-tips">
          <span className="aiec-tips__title">
            <Icon name="sparkle" size={16} style={{ color: 'var(--accent-primary)' }} />
            {t('capture.tipsTitle')}
          </span>
          <div className="aiec-tips__grid">
            {[t('capture.tip1'), t('capture.tip2'), t('capture.tip3')].map((tip) => (
              <span key={tip} className="aiec-tip">
                <Icon name="check-circle" size={13} />
                <span className="aiec-no-clip">{tip}</span>
              </span>
            ))}
          </div>
        </div>
      </Stack>
    </Screen>
  );
}
