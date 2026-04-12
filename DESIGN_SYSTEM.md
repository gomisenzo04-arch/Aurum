# Aurum Design System

> Premium dark trading terminal. Every pixel intentional. Gold whispers, never shouts.

---

## Aesthetic Direction

**Concept:** Dark Luxury Terminal — the visual language of precision instruments.
Think: a $50K watch meets a Bloomberg terminal meets a private banking app.

**Tone:** Confident, precise, restrained luxury. Gold is the signature — used for emphasis, never decoration.

**Memorable detail:** The gold accent line. Every primary surface has a 1px gold border-top or left-border accent. It's the visual thread that ties everything together.

---

## Typography

### Font Stack
```
Display/Headings: 'Bricolage Grotesque', system-ui, sans-serif
Body/UI: 'DM Sans', system-ui, sans-serif
Monospace/Data: 'JetBrains Mono', 'Fira Code', monospace
```

### Type Scale (1.2 ratio, base 13px)
```
--text-xs: 10px      /* Labels, badges, captions */
--text-sm: 11px      /* Secondary text, helper text */
--text-base: 13px    /* Body text, inputs, buttons */
--text-md: 15px      /* Emphasized body, subtitles */
--text-lg: 18px      /* Section headers */
--text-xl: 22px      /* Page titles */
--text-2xl: 28px     /* Hero numbers, KPI values */
--text-3xl: 36px     /* Display numbers (P&L, lot) */
--text-4xl: 48px     /* Hero display (session lot result) */
```

### Font Weights
```
--font-regular: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-black: 800
```

---

## Color Palette

### Backgrounds (4-step depth system)
```
--bg-base: #07090d       /* Deepest — page background */
--bg-raised: #0c1017     /* Cards, panels */
--bg-elevated: #121820   /* Inputs, nested elements */
--bg-overlay: #1a2230    /* Hover states, dividers */
```

### Borders
```
--border-subtle: #182038   /* Default borders — barely visible */
--border-default: #223052  /* Active borders — visible */
--border-strong: #2d4070   /* Focus/hover borders — prominent */
```

### Gold System (signature accent)
```
--gold-50: #fdf6e3        /* Lightest tint */
--gold-100: #f5e6b8       /* Light */
--gold-200: #f0d060        /* Bright highlight */
--gold-400: #d4a017        /* PRIMARY — the Aurum gold */
--gold-500: #b8860b        /* Muted gold */
--gold-600: #8b6914        /* Dark gold */
--gold-glow: rgba(212,160,23,.08)  /* Ambient glow */
--gold-border: rgba(212,160,23,.15) /* Subtle gold border */
--gold-surface: rgba(212,160,23,.06) /* Gold-tinted background */
```

### Semantic Colors
```
/* Success */
--green-400: #34d399
--green-500: #00d68f
--green-surface: rgba(0,214,143,.06)
--green-border: rgba(0,214,143,.15)

/* Danger */
--red-400: #f87171
--red-500: #ff4757
--red-surface: rgba(255,71,87,.06)
--red-border: rgba(255,71,87,.15)

/* Info */
--blue-400: #60a5fa
--blue-500: #5b8def
--blue-surface: rgba(91,141,239,.06)
--blue-border: rgba(91,141,239,.15)

/* Accent */
--purple-400: #c084fc
--purple-500: #a78bfa
--purple-surface: rgba(167,139,250,.06)
--purple-border: rgba(167,139,250,.15)
```

### Text
```
--text-primary: #e8ecf2     /* High contrast — headings, values */
--text-secondary: #8b9dc0   /* Body text */
--text-tertiary: #506580    /* Labels, captions, disabled */
--text-inverse: #07090d     /* Text on gold/bright backgrounds */
```

---

## Spacing Scale (4px base)

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

---

## Border Radius

```
--radius-xs: 4px      /* Tags, badges, small chips */
--radius-sm: 6px      /* Buttons, inputs, small cards */
--radius-md: 10px     /* Standard cards, modals */
--radius-lg: 14px     /* Large cards, panels */
--radius-xl: 20px     /* Hero sections, onboarding */
--radius-full: 9999px /* Pills, circular elements */
```

---

## Shadows (3-tier elevation)

```
--shadow-sm: 0 1px 3px rgba(0,0,0,.3), 0 1px 2px rgba(0,0,0,.2)
--shadow-md: 0 4px 16px rgba(0,0,0,.4), 0 2px 4px rgba(0,0,0,.2)
--shadow-lg: 0 12px 40px rgba(0,0,0,.5), 0 4px 12px rgba(0,0,0,.3)
--shadow-gold: 0 0 20px rgba(212,160,23,.06), 0 0 4px rgba(212,160,23,.03)
--shadow-glow-green: 0 0 12px rgba(0,214,143,.15)
--shadow-glow-red: 0 0 12px rgba(255,71,87,.15)
```

---

## Transitions

```
--ease-out: cubic-bezier(.16, 1, .3, 1)
--ease-in-out: cubic-bezier(.4, 0, .2, 1)

--duration-fast: 120ms      /* Hover states, toggles */
--duration-normal: 200ms    /* Standard interactions */
--duration-slow: 350ms      /* Panel transitions, reveals */
--duration-slower: 500ms    /* Page transitions */
```

---

## Z-Index Scale

```
--z-base: 0
--z-dropdown: 100
--z-sticky: 200
--z-overlay: 500
--z-modal: 600
--z-toast: 800
--z-nav: 900
--z-top: 1000
```

---

## Component Specifications

### Buttons
- **Primary:** `bg: --gold-surface` | `border: 1px solid --gold-border` | `color: --gold-400` | hover: `border-color: --gold-400; bg: rgba(212,160,23,.12)`
- **Secondary:** `bg: --bg-elevated` | `border: 1px solid --border-subtle` | `color: --text-secondary` | hover: `border-color: --border-default; color: --text-primary`
- **Danger:** `bg: --red-surface` | `border: 1px solid --red-border` | `color: --red-500`
- **Ghost:** `bg: transparent` | `border: none` | `color: --text-tertiary` | hover: `color: --text-secondary; bg: --bg-overlay`
- Min height: 40px (compact) / 44px (standard) / 48px (prominent)
- Border-radius: `--radius-sm`
- Transition: `all var(--duration-fast) var(--ease-out)`

### Cards
- Background: `--bg-raised`
- Border: `1px solid --border-subtle`
- Border-radius: `--radius-md`
- Padding: `--space-4` (compact) / `--space-5` (standard)
- Hover: `border-color: --gold-border`
- No transforms on hover. Background change only.

### Inputs
- Background: `--bg-elevated`
- Border: `1px solid --border-subtle`
- Border-radius: `--radius-sm`
- Padding: `10px 12px`
- Focus: `border-color: --gold-400; box-shadow: 0 0 0 2px rgba(212,160,23,.1)`
- Placeholder: `--text-tertiary`

### Tables
- Header: `bg: --bg-elevated` | `color: --text-tertiary` | `font-size: --text-xs` | `text-transform: uppercase` | `letter-spacing: .05em`
- Row hover: `bg: --gold-surface` | first-child: `box-shadow: inset 3px 0 0 --gold-400`
- NO transforms on hover. NO translateX.
- Cell padding: `--space-2 --space-3`

### Navigation
- Dropdown trigger: `color: --text-secondary` | hover: `color: --gold-400; bg: --gold-surface`
- Dropdown menu: `bg: --bg-raised` | `border: 1px solid --gold-border` | `shadow: --shadow-lg`
- Item hover: `bg: --gold-surface` | `color: --gold-400`

### Topbar
- Background: `linear-gradient(180deg, --bg-raised, --bg-base)`
- Border-bottom: `1px solid --gold-border`
- Height: 56px
- Shadow: `0 1px 12px rgba(0,0,0,.4)`

---

## Design Principles

1. **Gold whispers.** Never use solid gold backgrounds on large surfaces. Gold appears as: 1px borders, text color, small indicators, subtle glows.
2. **Depth through darkness.** 4 background tiers create depth without flashy effects.
3. **Data is the hero.** Numbers are large, monospaced, high-contrast. Labels are small, muted.
4. **No decorative transforms.** Hover states change color/background, never position. Content never shifts.
5. **Consistent rhythm.** All spacing in multiples of 4px. All radius from the same 6-value scale.
6. **One system, zero exceptions.**
