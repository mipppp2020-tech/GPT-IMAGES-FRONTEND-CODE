import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from './Icon';
import { useI18n } from '@/i18n';
import type { StringKey } from '@/i18n/strings';

/** Simulated OS status bar, so a render lines up with the canonical reference. */
export function DeviceStatusBar({ time = '9:41' }: { time?: string }) {
  return (
    <div className="aiec-statusbar" aria-hidden="true">
      <span>{time}</span>
      <span className="aiec-statusbar__right">
        <span className="aiec-statusbar__bars">
          <i style={{ height: 5 }} />
          <i style={{ height: 8 }} />
          <i style={{ height: 11 }} />
          <i style={{ height: 14 }} />
        </span>
        <span style={{ fontWeight: 600 }}>5G</span>
        <span className="aiec-statusbar__batt">
          <span className="aiec-statusbar__battfill" style={{ width: '100%' }} />
        </span>
        <span style={{ fontWeight: 600 }}>100%</span>
      </span>
    </div>
  );
}

/** The AIEC mark: an orange chevron against a dark solid, as in the reference. */
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M13.5 6.5 26 33.5h-7.4L11.8 18 6 33.5H0Z" fill="#FE5B01" transform="translate(5 1)" />
      <path d="M20 6.5 33 33.5h-6.6L15.5 10.5Z" fill="#141A22" transform="translate(5 1)" />
    </svg>
  );
}

export function AppBrand() {
  const { t } = useI18n();
  return (
    <div className="aiec-brand">
      <BrandMark />
      <span className="aiec-brand__text">
        <span className="aiec-brand__name">{t('brand.name')}</span>
        <span className="aiec-brand__tagline">{t('brand.tagline')}</span>
      </span>
    </div>
  );
}

/**
 * AppBar — the brand bar. Present on EVERY screen in the references, including
 * sub-screens, which stack a ContextBar beneath it rather than replacing it.
 */
export function AppBar({ notificationCount = 0 }: { notificationCount?: number }) {
  const { t } = useI18n();


  return (
    <header className="aiec-appbar">
      <AppBrand />
      <span className="aiec-appbar__spacer" />
      <button type="button" className="aiec-citychip">
        <Icon name="pin-filled" size={15} />
        {t('chrome.city')}
        <Icon name="chevron-down" size={14} stroke={2.4} />
      </button>
      <NavLink to="/notifications" className="aiec-iconbtn aiec-bell" aria-label={t('chrome.notifications')}>
        <Icon name="bell" size={22} />
        {notificationCount > 0 ? <span className="aiec-bell__badge">{notificationCount}</span> : null}
      </NavLink>
      <WhoAmI />
    </header>
  );
}

/**
 * RoleSwitcher's read-only face. The rider session shows who it is and at
 * what level; it does not offer other roles, because a rider client is not
 * permitted to hold another role's data (§10).
 */
export function WhoAmI() {
  const { t } = useI18n();
  return (
    <div className="aiec-whoami">
      <span className="aiec-whoami__avatar">
        <Icon name="user" size={22} />
      </span>
      <span className="aiec-whoami__text">
        <span className="aiec-whoami__hello">{t('chrome.greeting')}</span>
        <span className="aiec-whoami__name">{t('chrome.riderName')}</span>
        <span className="aiec-whoami__role">{t('chrome.riderLevel')}</span>
      </span>
    </div>
  );
}

const TABS: { to: string; icon: IconName; key: StringKey }[] = [
  { to: '/', icon: 'home', key: 'tab.home' },
  { to: '/leads', icon: 'list', key: 'tab.leads' },
  { to: '/earnings', icon: 'wallet', key: 'tab.earnings' },
  { to: '/profile', icon: 'user', key: 'tab.profile' },
];

export function TabBar() {
  const { t } = useI18n();
  return (
    <nav className="aiec-tabbar" aria-label={t('tab.home')}>
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) => `aiec-tab${isActive ? ' aiec-tab--active' : ''}`}
        >
          <Icon name={tab.icon} size={22} />
          <span className="aiec-tab__label">{t(tab.key)}</span>
        </NavLink>
      ))}
    </nav>
  );
}


/**
 * ContextBar — the back / title / actions row that sits UNDER the brand bar
 * on sub-screens. Keeping them separate is what lets every screen carry the
 * same identity strip while still offering local navigation.
 */
export function ContextBar({
  title,
  onBack,
  actions,
}: {
  title?: string;
  onBack?: () => void;
  actions?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <header className="aiec-appbar aiec-appbar--contextual">
      <button type="button" className="aiec-iconbtn" onClick={onBack} aria-label={t('chrome.back')}>
        <Icon name="chevron-left" size={22} />
      </button>
      {title ? <span className="aiec-appbar__title aiec-no-clip">{title}</span> : null}
      <span className="aiec-appbar__spacer" />
      {actions}
    </header>
  );
}
