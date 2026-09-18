import type { CSSProperties } from 'react';
import { Icon } from './Icon';
import { useI18n } from '@/i18n';
import { LIFECYCLE_STATES, LIFECYCLE_LABEL_KEY, type LifecycleState } from '@/domain/lifecycle';
import type { MapEntityPoint } from '@/domain/types';
import type { StringKey } from '@/i18n/strings';

/**
 * The basemap is drawn, not photographed, so that pins are real components
 * carrying lifecycle state rather than pixels baked into a tile. A screenshot
 * cannot answer "which of these is blocked"; this can.
 */
function BaseMap() {
  return (
    <svg className="aiec-map__canvas" viewBox="0 0 430 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="430" height="300" fill="#EDF1F2" />
      {/* parks */}
      <path d="M18 196h64v46H18z" fill="#DCEBD8" rx="4" />
      <path d="M296 40h58v40h-58z" fill="#DCEBD8" />
      <circle cx="112" cy="78" r="22" fill="#DCEBD8" />
      {/* river */}
      <path
        d="M270 0c-6 40 14 62 8 92-6 30-30 44-26 78 4 34 22 48 18 82"
        stroke="#BFDCEF"
        strokeWidth="11"
        fill="none"
        strokeLinecap="round"
      />
      {/* arterial roads */}
      <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
        <path d="M0 118h430" strokeWidth="9" />
        <path d="M148 0v300" strokeWidth="9" />
        <path d="M0 232h430" strokeWidth="7" />
        <path d="M330 0v300" strokeWidth="7" />
        <path d="M0 58h430" strokeWidth="5" />
        <path d="M62 0v300" strokeWidth="5" />
        <path d="M232 0v300" strokeWidth="5" />
        <path d="M0 172h430" strokeWidth="5" />
        <path d="M0 296l150-96 132 40 148-92" strokeWidth="6" />
        <path d="M0 14l128 70 150-44 152 62" strokeWidth="4" />
      </g>
      {/* minor grid */}
      <g stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" fill="none">
        <path d="M0 88h430M0 146h430M0 202h430M0 264h430" />
        <path d="M24 0v300M100 0v300M190 0v300M276 0v300M382 0v300" />
      </g>
      {/* locality labels */}
      <g fill="#6B7280" fontSize="10.5" fontWeight="600" fontFamily="'Noto Sans Devanagari', sans-serif">
        <text x="24" y="52">बाणेर</text>
        <text x="196" y="44">औंध</text>
        <text x="330" y="96">शिवाजीनगर</text>
        <text x="16" y="140">पाषाण</text>
        <text x="86" y="252">कोथरूड</text>
        <text x="300" y="186" fontSize="14" fill="#4B5563" fontWeight="700">पुणे</text>
        <text x="240" y="222">डेक्कन</text>
        <text x="30" y="290">कर्वेनगर</text>
        <text x="372" y="268">कात्रज</text>
      </g>
    </svg>
  );
}

/** MapEntity — one lead on the map, coloured by its lifecycle state. */
export function MapEntity({ point }: { point: MapEntityPoint }) {
  const { t } = useI18n();
  const label = t(LIFECYCLE_LABEL_KEY[point.state] as StringKey);
  return (
    <button
      type="button"
      className="aiec-map__pin aiec-inline-target"
      style={
        {
          left: `${point.x * 100}%`,
          top: `${point.y * 100}%`,
          '--pin-color': `var(--aiec-lifecycle-${point.state}-accent)`,
        } as CSSProperties
      }
      aria-label={`${point.label ?? ''} ${label}`.trim()}
    >
      {/* White keyline so a pin stays legible over roads, parks and water. */}
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
          fill="currentColor"
          stroke="#FFFFFF"
          strokeWidth="1.6"
        />
      </svg>
    </button>
  );
}

/** MapFilter — the lifecycle legend. Doubles as the map's filter control. */
export function MapFilter({
  active,
  onToggle,
}: {
  active?: Set<LifecycleState>;
  onToggle?: (s: LifecycleState) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="aiec-map__legend">
      {LIFECYCLE_STATES.map((s) => {
        const on = !active || active.has(s);
        return (
          <button
            key={s}
            type="button"
            className="aiec-legenditem aiec-inline-target"
            onClick={() => onToggle?.(s)}
            style={{ opacity: on ? 1 : 0.38 }}
          >
            <span
              className="aiec-legenditem__dot"
              style={{ background: `var(--aiec-lifecycle-${s}-accent)` }}
            />
            {t(LIFECYCLE_LABEL_KEY[s] as StringKey)}
          </button>
        );
      })}
    </div>
  );
}

export function MapView({
  points,
  self,
  height = 300,
  activeStates,
  onToggleState,
  variant = 'full',
}: {
  points: MapEntityPoint[];
  /** The rider's own position, normalised. */
  self?: { x: number; y: number };
  height?: number;
  activeStates?: Set<LifecycleState>;
  onToggleState?: (s: LifecycleState) => void;
  /**
   * 'full' — the dispatch map: legend, layer controls and scale.
   * 'mini' — a location inset showing one site. Filtering a single known
   *          point is meaningless, so the legend and controls are absent
   *          rather than present-but-useless.
   */
  variant?: 'full' | 'mini';
}) {
  const { t } = useI18n();
  const visible = activeStates ? points.filter((p) => activeStates.has(p.state)) : points;
  const mini = variant === 'mini';

  return (
    <div className="aiec-map" style={{ height }}>
      <BaseMap />

      {self ? (
        <>
          <span
            className="aiec-map__pin--self"
            style={{ position: 'absolute', left: `${self.x * 100}%`, top: `${self.y * 100}%` }}
            aria-label={t('home.myLocation')}
          />
          <span
            style={{
              position: 'absolute',
              left: `${self.x * 100}%`,
              top: `calc(${self.y * 100}% - 22px)`,
              transform: 'translateX(-50%)',
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text-primary)',
              background: 'rgba(255,255,255,0.9)',
              padding: '1px 6px',
              borderRadius: 999,
              whiteSpace: 'nowrap',
            }}
          >
            {t('home.myLocation')}
          </span>
        </>
      ) : null}

      {visible.map((p) => (
        <MapEntity key={p.id} point={p} />
      ))}

      {!mini ? <MapFilter active={activeStates} onToggle={onToggleState} /> : null}

      {!mini ? (
      <div className="aiec-map__controls">
        <button type="button" className="aiec-map__ctrl" aria-label={t('home.showRoute')}>
          <Icon name="navigation" size={18} />
        </button>
        <button type="button" className="aiec-map__ctrl" aria-label={t('home.filter')}>
          <Icon name="layers" size={18} />
        </button>
        <button type="button" className="aiec-map__ctrl" aria-label={t('home.myLocation')}>
          <Icon name="locate" size={18} />
        </button>
      </div>
      ) : null}

      {!mini ? (
        <div className="aiec-map__scale">
          <span className="aiec-map__scalebar" />
          2 {t('common.km')}
        </div>
      ) : null}
    </div>
  );
}
