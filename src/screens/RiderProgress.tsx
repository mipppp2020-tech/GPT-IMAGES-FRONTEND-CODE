import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen, Stack, SectionHeader } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { StageCard } from '@/components/Records';
import { AlertCard } from '@/components/EntityCard';
import { NextAction } from '@/components/NextAction';
import { useI18n } from '@/i18n';
import { PROGRESS_STAGES, SITE_RECORDS } from '@/data/records';
import type { StringKey } from '@/i18n/strings';

/**
 * SCREEN CONTRACT — S-R-10 Construction progress
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         see which build stage is live and evidence it
 * DOMINANT_ACTION     upload a progress photo
 * VISIBLE_COMPONENTS  AppBar, ContextBar, stage cards (EntityTimeline as
 *                     cards), expanded stage detail + meter + photos,
 *                     AlertCard, NextAction
 * WORKFLOW_STATE      stage 4 of 6 running at 60%
 * CURRENT_GATE        none — evidence here is additive, not gating
 * KEY_REQUIRED        none
 * DATA                six stages with dates, current-stage detail, photos
 * INTERACTIONS        expand a stage, filter stages, add note, upload photo
 * FORBIDDEN_DATA      contract value, owner commercials
 * RESPONSIVE          <360 photo strip scrolls; chips wrap under the title
 * IMPORTANT_STATES    offline (queued photo upload)
 */
export function RiderProgress() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { id } = useParams();
  const rec = SITE_RECORDS.find((r) => r.id === id) ?? SITE_RECORDS[0];
  const [openStage, setOpenStage] = useState('p4');

  return (
    <Screen
      statusBarTime="9:20"
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar title={t('records.title')} onBack={() => nav(`/records/${rec.id}`)} />
        </>
      }
      nextAction={
        <NextAction
          label={t('progress.uploadPhoto')}
          icon="camera"
          onPress={() => nav('/capture')}
          secondary={{ label: t('progress.addNote'), icon: 'list' }}
        />
      }
    >
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-3)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
            {rec.siteName}
          </h1>
          <span className="aiec-entity__metaitem" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <Icon name="pin-filled" size={14} />
            {rec.locality} - {rec.pincode}
          </span>
        </div>

        <SectionHeader
          title={t('progress.title')}
          action={
            <span style={{ display: 'flex', gap: 'var(--aiec-space-4)' }}>
              <button type="button" className="aiec-iconbtn" style={{ minWidth: 44, border: '1px solid var(--border-subtle)', borderRadius: 'var(--aiec-radius-2)' }} aria-label={t('progress.allStages')}>
                <Icon name="calendar" size={18} />
              </button>
              <button type="button" className="aiec-filterbtn">
                {t('progress.allStages')}
                <Icon name="chevron-down" size={15} />
              </button>
            </span>
          }
        />
        <p className="aiec-no-clip" style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 'calc(var(--aiec-space-6) * -1)' }}>
          {t('progress.subtitle')}
        </p>

        <div className="aiec-tlcards">
          {PROGRESS_STAGES.map((stage) => (
            <div key={stage.id} onClick={() => setOpenStage(stage.id === openStage ? '' : stage.id)}>
              <StageCard stage={stage} expanded={stage.id === openStage} />
              {stage.id === openStage && stage.detail ? (
                <section className="aiec-card" style={{ padding: 'var(--aiec-space-6)', display: 'grid', gap: 'var(--aiec-space-5)', marginTop: 10 }}>
                  <SectionHeader
                    title={t('progress.recentPhotos', { date: '16 ऑगस्ट, 2025' })}
                    action={
                      <button type="button" className="aiec-section__action" style={{ color: 'var(--aiec-lifecycle-selling-text)' }}>
                        {t('progress.allPhotos')}
                        <Icon name="chevron-right" size={15} />
                      </button>
                    }
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--aiec-space-5)' }}>
                    {stage.detail.photos.map((p) => (
                      <figure key={p.captionKey} style={{ display: 'grid', gap: 'var(--aiec-space-3)' }}>
                        <img
                          src={p.src}
                          alt=""
                          style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 'var(--aiec-radius-2)' }}
                        />
                        <figcaption className="aiec-no-clip" style={{ fontSize: 10, lineHeight: '13px', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 600 }}>
                          {t(p.captionKey as StringKey)}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          ))}
        </div>

        <AlertCard title={t('progress.infoTitle')} text={t('progress.infoBody')} icon="info" tone="selling" />
      </Stack>
    </Screen>
  );
}
