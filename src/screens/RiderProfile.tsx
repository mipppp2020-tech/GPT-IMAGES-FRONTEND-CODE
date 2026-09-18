import { Screen, Stack } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { RoleSwitcher } from '@/components/Decision';
import { SettingGroup, SettingRow } from '@/components/Records';
import { useI18n } from '@/i18n';

/**
 * SCREEN CONTRACT — S-R-15 My profile
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         check and adjust my identity, preferences and security
 * DOMINANT_ACTION     edit profile
 * VISIBLE_COMPONENTS  AppBar, RoleSwitcher, personal rows, preference rows,
 *                     security rows, other rows, TabBar
 * WORKFLOW_STATE      none
 * CURRENT_GATE        none
 * KEY_REQUIRED        none
 * DATA                name, mobile, email, address, verification state, prefs
 * INTERACTIONS        edit a field, change language/theme, 2FA, log out
 * FORBIDDEN_DATA      any other role's identity or data
 * RESPONSIVE          <360 row values wrap under their labels
 * IMPORTANT_STATES    verified vs unverified contact, 2FA disabled
 *
 * The identity card is the RoleSwitcher primitive. It deliberately offers no
 * other role: a rider client is not permitted to hold another role's data, so
 * a switcher that appeared to offer one would misrepresent the client (§10).
 */
export function RiderProfile() {
  const { t } = useI18n();
  const verified = (
    <span className="aiec-chip" style={{ background: 'var(--aiec-lifecycle-done-surface)', color: 'var(--aiec-lifecycle-done-text)' }}>
      {t('profile.verifiedChip')}
    </span>
  );

  return (
    <Screen statusBarTime="9:20" header={<AppBar notificationCount={3} />}>
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-2)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
            {t('profile.title')}
          </h1>
          <p className="aiec-no-clip" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {t('profile.subtitle')}
          </p>
        </div>

        <RoleSwitcher />

        <Section title={t('profile.personal')} />
        <SettingGroup>
          <SettingRow layout="inline" icon="user" label={t('profile.fullName')} value={t('profile.fullNameV')} />
          <SettingRow layout="inline" icon="phone" label={t('profile.mobile')} value={t('profile.mobileV')} right={verified} />
          <SettingRow layout="inline" icon="message" label={t('profile.email')} value={t('profile.emailV')} right={verified} />
          <SettingRow layout="inline" icon="pin" label={t('profile.address')} value={t('profile.addressV')} />
        </SettingGroup>

        <Section title={t('profile.prefs')} />
        <SettingGroup>
          <SettingRow icon="bell" label={t('profile.notifPrefs')} value={t('profile.notifPrefsSub')} highlight />
          <SettingRow icon="sparkle" label={t('profile.language')} value={t('profile.languageSub')} />
          <SettingRow icon="layers" label={t('profile.theme')} value={t('profile.themeSub')} />
        </SettingGroup>

        <Section title={t('profile.security')} />
        <SettingGroup>
          <SettingRow icon="lock" label={t('profile.password')} value={t('profile.passwordSub')} />
          <SettingRow
            icon="shield"
            label={t('profile.twofa')}
            value={t('profile.twofaSub')}
            right={<span className="aiec-chip">{t('profile.twofaChip')}</span>}
          />
        </SettingGroup>

        <Section title={t('profile.other')} />
        <SettingGroup>
          <SettingRow icon="list" label={t('profile.terms')} />
          <SettingRow icon="info" label={t('profile.helpSupport')} />
          <SettingRow icon="arrow-right" label={t('profile.logout')} danger />
        </SettingGroup>
      </Stack>
    </Screen>
  );
}

function Section({ title }: { title: string }) {
  return (
    <h2 style={{ fontSize: 'var(--aiec-type-h2-size)', fontWeight: 700, marginTop: 'var(--aiec-space-4)' }}>
      {title}
    </h2>
  );
}
