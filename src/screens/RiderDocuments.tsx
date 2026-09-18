import { useNavigate, useParams } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { DocumentRow } from '@/components/Records';
import { AlertCard } from '@/components/EntityCard';
import { NextAction } from '@/components/NextAction';
import { useI18n } from '@/i18n';
import { DOCUMENTS, SITE_RECORDS } from '@/data/records';
import { isDocumentSatisfied } from '@/domain/types';
import type { ActionState } from '@/domain/lifecycle';

import d1 from '@/assets/doc-permission.jpg';
import d2 from '@/assets/doc-extract.jpg';
import d3 from '@/assets/doc-plan.jpg';
import d4 from '@/assets/doc-certificate.jpg';

const PREVIEWS: Record<string, string> = { d1, d2, d3, d4 };

/**
 * SCREEN CONTRACT — S-R-11 Document upload
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         supply the six statutory documents for this site
 * DOMINANT_ACTION     continue — GATED on all required documents
 * VISIBLE_COMPONENTS  AppBar, ContextBar, DocumentRow x6, format AlertCard,
 *                     NextAction / KeyringGate
 * WORKFLOW_STATE      documents stage, 4 of 6 satisfied
 * CURRENT_GATE        evidence: 6 required documents
 * KEY_REQUIRED        every document marked * uploaded and accepted
 * DATA                per-document state (uploaded / uploading / missing)
 * INTERACTIONS        choose file, replace, cancel upload, view
 * FORBIDDEN_DATA      owner commercials
 * RESPONSIVE          <360 previews drop, actions move to a full-width row
 * IMPORTANT_STATES    uploading (percent shown), missing (named, not hidden),
 *                     offline (uploads queue rather than fail)
 *
 * The reference draws "पुढे" as an enabled button while documents 5 and 6 are
 * incomplete and both are marked required. Continuing would fail server-side,
 * so §12 requires the lock be shown instead. See DEVIATIONS.md.
 */
export function RiderDocuments() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { id } = useParams();
  const rec = SITE_RECORDS.find((r) => r.id === id) ?? SITE_RECORDS[0];

  const required = DOCUMENTS.filter((d) => d.required);
  const satisfied = required.filter(isDocumentSatisfied);
  const outstanding = required.filter((d) => !isDocumentSatisfied(d));

  const action: ActionState =
    outstanding.length === 0
      ? { kind: 'open' }
      : {
          kind: 'gated',
          gate: {
            reason: `${outstanding.length} आवश्यक दस्तऐवज अद्याप पूर्ण झालेले नाहीत.`,
            unlockableBy: 'तुम्ही — उरलेले दस्तऐवज अपलोड करून',
            requirement: {
              kind: 'evidence',
              label: t('docs.instruction'),
              collected: satisfied.length,
              required: required.length,
            },
            nextStep: 'सर्व दस्तऐवज मिळाल्यावर शुल्क भरण्याची पायरी उघडेल.',
          },
        };

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
          label={t('docs.next')}
          action={action}
          onPress={() => nav(`/records/${rec.id}/fees`)}
          secondary={{ label: t('photos.back'), icon: 'arrow-left', onPress: () => nav(-1) }}
        />
      }
    >
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-3)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
            {t('docs.title')}
          </h1>
          <span className="aiec-no-clip" style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            {rec.siteName}
          </span>
          <span className="aiec-entity__metaitem" style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
            <Icon name="pin-filled" size={14} />
            {rec.locality} - {rec.pincode}
          </span>
          <p className="aiec-no-clip" style={{ fontSize: 12.5, lineHeight: '18px', color: 'var(--text-secondary)', marginTop: 'var(--aiec-space-3)' }}>
            {t('docs.instruction')}
          </p>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {DOCUMENTS.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} preview={PREVIEWS[doc.id]} />
          ))}
        </div>

        <AlertCard title={t('docs.formatTitle')} text={t('docs.formatBody')} icon="info" tone="selling" />
      </Stack>
    </Screen>
  );
}
