import type { LifecycleMeta } from '../lib/lifecycle'

/** Renders the shape+colour lifecycle marker. Shape carries meaning, not just hue,
 * so state survives colour-blindness and direct sunlight glare. */
export function LifecycleMark({ meta, size = 14 }: { meta: LifecycleMeta; size?: number }) {
  const s = size
  const common = { width: s, height: s }

  switch (meta.shape) {
    case 'hollow-circle':
      return (
        <span
          style={{ ...common, border: `2.5px solid ${meta.color}` }}
          className="inline-block rounded-full bg-transparent shrink-0"
        />
      )
    case 'half-circle':
      return (
        <span
          style={{
            ...common,
            border: `2.5px solid ${meta.color}`,
            background: `linear-gradient(90deg, ${meta.color} 50%, transparent 50%)`,
          }}
          className="inline-block rounded-full shrink-0"
        />
      )
    case 'dot-circle':
      return (
        <span
          style={{ ...common, border: `2.5px solid ${meta.color}` }}
          className="relative inline-flex items-center justify-center rounded-full shrink-0"
        >
          <span
            style={{ background: meta.color, width: s * 0.4, height: s * 0.4 }}
            className="rounded-full"
          />
        </span>
      )
    case 'chevron':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
          <path
            d="M4 2 L11 8 L4 14"
            stroke={meta.color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'ring':
      return (
        <span
          style={{ ...common, border: `2.5px solid ${meta.color}`, borderTopColor: 'transparent' }}
          className="inline-block rounded-full shrink-0"
        />
      )
    case 'check':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" className="shrink-0">
          <path
            d="M3 8.5 L6.5 12 L13 4"
            stroke={meta.color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'square-bang':
      return (
        <span
          style={{ ...common, background: meta.color }}
          className="relative inline-flex items-center justify-center rounded-[3px] shrink-0"
        >
          <span className="text-white font-extrabold leading-none" style={{ fontSize: s * 0.7 }}>
            !
          </span>
        </span>
      )
    case 'slashed-square':
      return (
        <span
          style={{ ...common, border: `2.5px solid ${meta.color}` }}
          className="relative inline-block rounded-[3px] shrink-0 overflow-hidden"
        >
          <span
            style={{ background: meta.color, height: 2.5, width: s * 1.3, top: '48%', left: -s * 0.15 }}
            className="absolute rotate-45"
          />
        </span>
      )
    default:
      return null
  }
}
