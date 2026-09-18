import { Screen, Stack } from '@/app/Screen';
import { AppBar } from '@/components/Chrome';
import { AlertCard } from '@/components/EntityCard';
import { useI18n } from '@/i18n';

/**
 * Routes that exist in the rider tab bar but are not part of the Rider
 * screen tranche implemented so far. This renders an honest "not built yet"
 * rather than a half-built screen that would drift from the references.
 */
export function Placeholder({ titleKey }: { titleKey: 'tab.earnings' | 'tab.profile' | 'chrome.notifications' }) {
  const { t } = useI18n();
  return (
    <Screen header={<AppBar notificationCount={3} />}>
      <Stack gap="loose" style={{ paddingBlock: 'var(--aiec-space-9)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>{t(titleKey)}</h1>
        <AlertCard
          title="ही स्क्रीन अद्याप तयार नाही"
          text="रायडर ट्रँचमध्ये 7 स्क्रीन पूर्ण झाल्या आहेत. ही स्क्रीन पुढील ट्रँचमध्ये येईल."
          icon="info"
          tone="new"
        />
      </Stack>
    </Screen>
  );
}
