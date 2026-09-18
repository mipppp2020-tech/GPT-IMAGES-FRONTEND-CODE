import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { WorkflowProgress } from '@/components/Workflow';
import { NextAction } from '@/components/NextAction';
import { AlertCard } from '@/components/EntityCard';
import { useI18n } from '@/i18n';
import { RIDER_LEADS } from '@/data/fixtures';
import type { ActionState } from '@/domain/lifecycle';

import e1 from '@/assets/evidence-1.jpg';
import e2 from '@/assets/evidence-2.jpg';
import e3 from '@/assets/evidence-3.jpg';
import e4 from '@/assets/evidence-4.jpg';
import e5 from '@/assets/evidence-5.jpg';

const REQUIRED_PHOTOS = 5;
const MAX_PHOTOS = 10;

/**
 * SCREEN CONTRACT — S-R-04 Site photos (capture step 3)
 *
 * ROLE                rider
 * THEME               sunlight (page) with slate-grade evidence controls
 * VIEWPORT            430x932
 * PRIMARY_JOB         supply the five angles that let AIEC verify the site
 * DOMINANT_ACTION     continue — GATED on the evidence requirement
 * VISIBLE_COMPONENTS  AppBar(contextual), WorkflowProgress(5), quality guide,
 *                     photo grid, notes field, NextAction/KeyringGate
 * WORKFLOW_STATE      step 3 of 5
 * CURRENT_GATE        evidence: 5 site photos
 * KEY_REQUIRED        five captioned photos
 * DATA                captured photos + captions, free-text note
 * INTERACTIONS        add photo, remove photo, caption, write note
 * FORBIDDEN_DATA      commercial fields
 * RESPONSIVE          <360 grid falls to 2 columns
 * IMPORTANT_STATES    under-count (gated), at max (add tile withdrawn),
 *                     offline (photos held locally, still listed)
 *
 * The continue action is genuinely gated: with fewer than five photos the
 * screen renders a KeyringGate stating why, who, what and what-next, instead
 * of a greyed-out button.
 */
export function RiderSitePhotos() {
  const { t } = useI18n();
  const nav = useNavigate();
  const lead = RIDER_LEADS[0];

  const photos = [
    { src: e1, caption: t('photos.front') },
    { src: e2, caption: t('photos.left') },
    { src: e3, caption: t('photos.rear') },
    { src: e4, caption: t('photos.inside') },
    { src: e5, caption: t('photos.roof') },
  ];

  const action: ActionState =
    photos.length >= REQUIRED_PHOTOS
      ? { kind: 'open' }
      : {
          kind: 'gated',
          gate: {
            reason: 'साइट पडताळणीसाठी किमान 5 फोटो आवश्यक आहेत.',
            unlockableBy: 'तुम्ही — साइटवरून फोटो घेऊन',
            requirement: {
              kind: 'evidence',
              label: t('photos.subtitle'),
              collected: photos.length,
              required: REQUIRED_PHOTOS,
            },
            nextStep: 'फोटो पूर्ण झाल्यावर पेमेंट तपशील उघडेल.',
          },
        };

  return (
    <Screen
      statusBarTime="9:20"
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar
            title={t('leads.title')}
            onBack={() => nav(-1)}
            actions={
              <button type="button" className="aiec-chip aiec-chip--interactive">
                <Icon name="users" size={15} />
                साइट पहा
              </button>
            }
          />
        </>
      }
      nextAction={
        <NextAction
          label={t('photos.next')}
          action={action}
          onPress={() => nav('/payout')}
          secondary={{ label: t('photos.back'), icon: 'arrow-left', onPress: () => nav(-1) }}
        />
      }
    >
      <Stack gap="loose" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-2)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 23, lineHeight: '30px', fontWeight: 800 }}>
            {lead.siteName}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {lead.locality} - {lead.pincode}
          </p>
        </div>

        {/* The tracker shows the LEAD's journey, not the capture wizard's
            steps: at this point the rider is servicing an existing lead. */}
        <WorkflowProgress
          current={2}
          steps={[
            { label: t('lifecycle.new'), note: '16 ऑग' },
            { label: t('lifecycle.selling'), note: '18 ऑग' },
            { label: 'करार अपेक्षित', note: 'सध्या' },
            { label: 'साईट पाहणी' },
            { label: t('leads.statWon') },
          ]}
        />

        <AlertCard title={t('photos.title')} text={t('photos.subtitle')} icon="camera" tone="info" />

        <div className="aiec-quality">
          <span className="aiec-tips__title">
            <Icon name="sparkle" size={16} style={{ color: 'var(--aiec-lifecycle-done-accent)' }} />
            {t('photos.qualityTitle')}
          </span>
          <div className="aiec-quality__grid">
            {[t('photos.q1'), t('photos.q2'), t('photos.q3'), t('photos.q4')].map((q) => (
              <span key={q} className="aiec-quality__item">
                <Icon name="check-circle" size={13} />
                <span className="aiec-no-clip">{q}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="aiec-photogrid">
          {photos.map((p) => (
            <figure key={p.caption} className="aiec-photo">
              <img src={p.src} alt={p.caption} />
              <button type="button" className="aiec-photo__remove" aria-label={`${p.caption} — काढा`}>
                <Icon name="close" size={12} stroke={2.6} />
              </button>
              <figcaption className="aiec-photo__caption aiec-no-clip">{p.caption}</figcaption>
            </figure>
          ))}
          {photos.length < MAX_PHOTOS ? (
            <button type="button" className="aiec-photo aiec-photo--add">
              <Icon name="camera" size={20} />
              {t('photos.addMore')}
              <span>{t('photos.addMoreHint')}</span>
            </button>
          ) : null}
        </div>

        <div className="aiec-field">
          <span className="aiec-field__label">{t('photos.notesLabel')}</span>
          <div className="aiec-field__box">
            <Icon name="list" size={17} style={{ color: 'var(--icon-secondary)', flex: 'none' }} />
            <textarea placeholder={t('photos.notesPlaceholder')} maxLength={500} />
          </div>
          <span className="aiec-field__count">0/500</span>
        </div>
      </Stack>
    </Screen>
  );
}
