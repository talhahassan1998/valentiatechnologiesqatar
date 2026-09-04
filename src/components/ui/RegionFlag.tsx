/**
 * Small flag marks for the regions Valentia operates in.
 *
 * Drawn inline rather than pulled from an icon set: these are seven fixed,
 * simple shapes, so a dependency (or seven raster files) would cost more than
 * the markup. Emoji flags are not an option — they render inconsistently
 * across platforms and are absent on most Windows builds.
 *
 * Every flag is decorative: the region name always sits beside it as visible
 * text, so the SVG is aria-hidden and carries no title.
 */

const VB = '0 0 24 16'

/** Southern Cross, shared by the New Zealand and Australian marks. */
function Stars({ crimson }: { crimson: boolean }) {
  const fill = crimson ? 'var(--color-v-crimson-400)' : '#fff'
  return (
    <g fill={fill}>
      <circle cx="17" cy="5" r="0.9" />
      <circle cx="20" cy="8" r="0.9" />
      <circle cx="17" cy="11.5" r="0.9" />
      <circle cx="14.5" cy="8.5" r="0.75" />
    </g>
  )
}

/** Union canton — the top-left quarter on the NZ and AU flags. */
function Canton() {
  return (
    <>
      <rect x="0" y="0" width="12" height="8" fill="var(--color-v-blue-800)" />
      <path d="M0 0l12 8M12 0L0 8" stroke="#fff" strokeWidth="1.6" />
      <path d="M6 0v8M0 4h12" stroke="#fff" strokeWidth="2.6" />
      <path d="M6 0v8M0 4h12" stroke="var(--color-v-crimson-500)" strokeWidth="1.2" />
    </>
  )
}

export function RegionFlag({ region }: { region: string }) {
  const common = {
    width: 18,
    height: 12,
    viewBox: VB,
    'aria-hidden': true as const,
    className: 'shrink-0 rounded-[1px]',
  }

  switch (region) {
    case 'New Zealand':
      return (
        <svg {...common}>
          <rect width="24" height="16" fill="var(--color-v-blue-700)" />
          <Canton />
          <Stars crimson />
        </svg>
      )

    case 'Australia':
      return (
        <svg {...common}>
          <rect width="24" height="16" fill="var(--color-v-blue-700)" />
          <Canton />
          <Stars crimson={false} />
          <circle cx="6" cy="12.5" r="1.5" fill="#fff" />
        </svg>
      )

    case 'South Pacific':
      // No single flag for a region — a wave reads as ocean without implying
      // one nation stands for the group.
      return (
        <svg {...common}>
          <rect width="24" height="16" fill="var(--color-v-blue-600)" />
          <path
            d="M0 6q3-2 6 0t6 0 6 0 6 0M0 11q3-2 6 0t6 0 6 0 6 0"
            fill="none"
            stroke="#fff"
            strokeWidth="1.1"
            opacity="0.9"
          />
        </svg>
      )

    case 'Ireland':
      return (
        <svg {...common}>
          <rect width="8" height="16" fill="#169b62" />
          <rect x="8" width="8" height="16" fill="#fff" />
          <rect x="16" width="8" height="16" fill="#ff883e" />
        </svg>
      )

    case 'South Africa':
      return (
        <svg {...common}>
          <rect width="24" height="16" fill="#002395" />
          <path d="M0 0h24v5.5H0z" fill="#de3831" />
          <path d="M0 10.5h24V16H0z" fill="#002395" />
          <path d="M0 5.5h24v5H0z" fill="#fff" />
          <path d="M0 0l9 8-9 8z" fill="#007a4d" />
          <path d="M0 2l7.5 6L0 14z" fill="#ffb612" />
        </svg>
      )

    case 'Qatar':
      return (
        <svg {...common}>
          <rect width="24" height="16" fill="#8d1b3d" />
          <path d="M0 0h6v16H0z" fill="#fff" />
          <path
            d="M6 0l2.4 1.33L6 2.67l2.4 1.33L6 5.33l2.4 1.34L6 8l2.4 1.33L6 10.67l2.4 1.33L6 13.33l2.4 1.34L6 16z"
            fill="#fff"
          />
        </svg>
      )

    case 'Dubai':
      // The UAE flag; Dubai's own is a plain red field that would read as a
      // colour swatch at this size.
      return (
        <svg {...common}>
          <rect width="24" height="16" fill="#00732f" />
          <rect y="5.33" width="24" height="5.34" fill="#fff" />
          <rect y="10.67" width="24" height="5.33" fill="#000" />
          <rect width="6" height="16" fill="#ff0000" />
        </svg>
      )

    default:
      // Unknown region: a neutral marker, so adding one to content.ts degrades
      // to a dot rather than a gap.
      return (
        <svg {...common}>
          <rect width="24" height="16" fill="var(--color-v-ink-600)" />
          <circle cx="12" cy="8" r="3" fill="var(--color-v-ink-300)" />
        </svg>
      )
  }
}
