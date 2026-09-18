import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { DecisionCard, MultiSelect, RatingScale } from '@/components/Decision';
import { AlertCard } from '@/components/EntityCard';
import { NextAction } from '@/components/NextAction';
import { Icon } from '@/components/Icon';
import { useI18n } from '@/i18n';
import type { ActionState } from '@/domain/lifecycle';

/**
 * SCREEN CONTRACT — S-R-16 Feedback
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         tell AIEC how the last job went
 * DOMINANT_ACTION     submit feedback — GATED until the required rating is given
 * VISIBLE_COMPONENTS  AppBar, ContextBar, intro AlertCard, DecisionCard x3
 *                     (RatingScale, MultiSelect, free text), thanks note,
 *                     NextAction / KeyringGate
 * WORKFLOW_STATE      none
 * CURRENT_GATE        the rating question, which the screen marks * आवश्यक
 * KEY_REQUIRED        one rating
 * DATA                rating, liked aspects, free text (max 500)
 * INTERACTIONS        rate, multi-select, type, submit
 * FORBIDDEN_DATA      none — this is the rider's own opinion
 * RESPONSIVE          <360 the 5-point scale stays one row at reduced padding
 * IMPORTANT_STATES    nothing rated yet (gated), offline (queued)
 *
 * The screen itself marks the rating "* आवश्यक". Honouring that marking is
 * what §12 requires: submit is a lock with a reason until a rating exists,
 * not a button that silently rejects.
 */
export function RiderFeedback() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [rating, setRating] = useState<number | null>(4);
  const [liked, setLiked] = useState<Set<string>>(new Set(['o1', 'o2']));
  const [note, setNote] = useState('');

  const toggle = (id: string) =>
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const action: ActionState =
    rating !== null
      ? { kind: 'open' }
      : {
          kind: 'gated',
          gate: {
            reason: 'अनुभवाचे रेटिंग दिल्याशिवाय अभिप्राय सबमिट करता येणार नाही.',
            unlockableBy: 'तुम्ही — वरील पाच पैकी एक निवडून',
            requirement: { kind: 'evidence', label: t('fb.q1'), collected: 0, required: 1 },
            nextStep: 'रेटिंग दिल्यावर अभिप्राय AIEC टीमकडे पाठवला जाईल.',
          },
        };

  return (
    <Screen
      statusBarTime="9:20"
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar onBack={() => nav(-1)} />
        </>
      }
      nextAction={<NextAction label={t('fb.submit')} action={action} onPress={() => nav('/')} />}
    >
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-2)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
            {t('fb.title')}
          </h1>
          <p className="aiec-no-clip" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {t('fb.subtitle')}
          </p>
        </div>

        <AlertCard title={t('fb.introTitle')} text={t('fb.introBody')} icon="message" tone="selling" />

        <DecisionCard title={t('fb.q1')} required>
          <RatingScale
            value={rating}
            onChange={setRating}
            labels={[t('fb.r1'), t('fb.r2'), t('fb.r3'), t('fb.r4'), t('fb.r5')]}
          />
        </DecisionCard>

        <DecisionCard title={t('fb.q2')} subtitle={t('fb.q2sub')}>
          <MultiSelect
            selected={liked}
            onToggle={toggle}
            options={[
              { id: 'o1', label: t('fb.o1') },
              { id: 'o2', label: t('fb.o2') },
              { id: 'o3', label: t('fb.o3') },
              { id: 'o4', label: t('fb.o4') },
              { id: 'o5', label: t('fb.o5') },
              { id: 'o6', label: t('fb.o6') },
            ]}
          />
        </DecisionCard>

        <DecisionCard title={t('fb.q3')}>
          <div className="aiec-field">
            <div className="aiec-field__box">
              <textarea
                placeholder={t('fb.placeholder')}
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ minHeight: 96 }}
              />
            </div>
            <span className="aiec-field__count">{note.length}/500</span>
          </div>
        </DecisionCard>

        <div className="aiec-safety">
          <span className="aiec-safety__icon">
            <Icon name="check-circle" size={18} />
          </span>
          <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
            <span className="aiec-safety__title aiec-no-clip">{t('fb.thanksTitle')}</span>
            <span className="aiec-safety__body aiec-no-clip">{t('fb.thanksBody')}</span>
          </span>
        </div>
      </Stack>
    </Screen>
  );
}
