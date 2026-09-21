import { useNavigate, useRouteError } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { NextAction } from '@/components/NextAction';
import { useI18n } from '@/i18n';

/**
 * SCREEN CONTRACT — S-R-00 Unknown address
 *
 * ROLE                rider
 * THEME               sunlight
 * PRIMARY_JOB         return a rider who landed on a dead link to solid ground
 * DOMINANT_ACTION     go home
 * WORKFLOW_STATE      none — the rider is outside the flow
 * FORBIDDEN_DATA      stack traces, route paths, status codes
 *
 * This exists because the router's own fallback is a developer artefact: an
 * English stack trace on a Marathi phone. A rider who mistypes a shared link
 * must still see the brand bar, their own language, and one way forward — and
 * must be told their captured work is untouched, because that is the first
 * thing they will fear.
 */
export function NotFound() {
  const { t } = useI18n();
  const nav = useNavigate();
  // Consume the router error so it is handled rather than rethrown; it is
  // deliberately not rendered — a route path is not rider-facing content.
  useRouteError();

  return (
    <Screen header={<AppBar notificationCount={3} />} statusBarTime="9:20">
      <Stack gap="loose" style={{ paddingTop: 'var(--aiec-space-8)' }}>
        <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--aiec-space-6)', textAlign: 'center' }}>
          <span
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'var(--surface-sunken)',
              color: 'var(--text-muted)',
            }}
          >
            <Icon name="pin" size={40} stroke={2} />
          </span>
          <h1 className="aiec-no-clip" style={{ fontSize: 'var(--aiec-type-h2-size)', fontWeight: 800 }}>
            {t('notfound.title')}
          </h1>
          <p className="aiec-no-clip" style={{ color: 'var(--text-muted)', maxWidth: '34ch' }}>
            {t('notfound.body')}
          </p>
        </div>

        <NextAction label={t('notfound.action')} icon="home" onPress={() => nav('/')} onPage />
      </Stack>
    </Screen>
  );
}
