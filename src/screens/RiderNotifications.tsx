import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Stack } from '@/app/Screen';
import { AppBar, ContextBar } from '@/components/Chrome';
import { Icon } from '@/components/Icon';
import { NotificationCenter, Segments } from '@/components/Records';
import { useI18n } from '@/i18n';
import { NOTIFICATIONS } from '@/data/records';

/**
 * SCREEN CONTRACT — S-R-14 Notifications
 *
 * ROLE                rider
 * THEME               sunlight
 * VIEWPORT            430x932
 * PRIMARY_JOB         catch up on what changed and act on what needs action
 * DOMINANT_ACTION     none singular — each item carries its own
 * VISIBLE_COMPONENTS  AppBar, ContextBar, Segments(4), NotificationCenter,
 *                     settings footer, TabBar
 * WORKFLOW_STATE      none
 * CURRENT_GATE        none
 * KEY_REQUIRED        none
 * DATA                notifications with tone, timestamp and optional action
 * INTERACTIONS        filter, open item, open notification settings
 * FORBIDDEN_DATA      owner commercials in message bodies
 * RESPONSIVE          <360 filter pills scroll; timestamp drops below title
 * IMPORTANT_STATES    unread (dot on the filter), empty filter result
 */
export function RiderNotifications() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [filter, setFilter] = useState('all');

  const items = useMemo(
    () => (filter === 'all' ? NOTIFICATIONS : NOTIFICATIONS.filter((n) => n.category === filter)),
    [filter],
  );

  return (
    <Screen
      statusBarTime="9:20"
      header={
        <>
          <AppBar notificationCount={3} />
          <ContextBar onBack={() => nav(-1)} />
        </>
      }
    >
      <Stack gap="base" style={{ paddingBottom: 'var(--aiec-space-9)' }}>
        <div style={{ display: 'grid', gap: 'var(--aiec-space-2)' }}>
          <h1 className="aiec-no-clip" style={{ fontSize: 26, lineHeight: '33px', fontWeight: 800 }}>
            {t('notif.title')}
          </h1>
          <p className="aiec-no-clip" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {t('notif.subtitle')}
          </p>
        </div>

        <Segments
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'all', label: t('notif.tabAll'), count: 3 },
            { id: 'unread', label: t('notif.tabUnread'), count: 1, dot: true },
            { id: 'important', label: t('notif.tabImportant'), count: 1 },
            { id: 'system', label: t('notif.tabSystem'), count: 1 },
          ]}
        />

        <NotificationCenter items={items} />

        <div className="aiec-alert" style={{ alignItems: 'center' }}>
          <span className="aiec-alert__icon">
            <Icon name="bell" size={17} />
          </span>
          <div className="aiec-alert__body">
            <span className="aiec-alert__title aiec-no-clip">{t('notif.footerTitle')}</span>
            <span className="aiec-alert__text aiec-no-clip">{t('notif.footerBody')}</span>
          </div>
          <button
            type="button"
            className="aiec-doc__action aiec-doc__action--info"
            style={{ flex: 'none', alignSelf: 'center', minHeight: 44 }}
          >
            <Icon name="list" size={15} />
            {t('notif.settings')}
          </button>
        </div>
      </Stack>
    </Screen>
  );
}
