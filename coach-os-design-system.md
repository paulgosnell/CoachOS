# Coach OS - Design System & Brand Guidelines

**Version:** 2.0
**Last Updated:** November 14, 2025
**Status:** Production-Ready Design Language

---

## Brand Positioning

**Brand Essence:** Business Class Excellence  
**Brand Promise:** Premium coaching that fits your life  
**Brand Personality:** Professional, Confident, Sophisticated, Trustworthy, Supportive

**Target Feeling:** Users should feel like they're part of an exclusive club for ambitious business leaders. Think: American Express Black Card, not generic SaaS tool.

---

## Design Principles

### 1. Premium Without Pretense
- Elegant and refined, but never flashy
- Sophisticated use of space and typography
- Quality over quantity in every interaction

### 2. Mobile-First, Always
- One-handed operation optimized
- Generous touch targets (minimum 44x44px)
- Bottom-weighted navigation and actions
- Thumb-friendly zones

### 3. Clarity Over Cleverness
- Clear communication always wins
- No confusing jargon or unnecessary complexity
- Obvious affordances, predictable interactions

### 4. Performance is Design
- Instant feedback to every action
- Smooth animations (60fps)
- Perceived performance > actual performance
- Loading states that feel intentional

### 5. Dark Mode Native
- Dark mode is default, not an afterthought
- Colors chosen for OLED optimization
- Reduce eye strain for late-night use
- Professional aesthetic for business context

---

## Color System

### Primary Palette

```css
/* Neutrals - Titanium Gradient */
--gray-950: #0A0A0A;  /* Pure black backgrounds */
--gray-900: #1A1A1A;  /* Card backgrounds */
--gray-800: #2D2D2D;  /* Elevated surfaces */
--gray-700: #404040;  /* Borders, dividers */
--gray-600: #525252;  /* Disabled states */
--gray-500: #737373;  /* Subtle text */
--gray-400: #A3A3A3;  /* Secondary text */
--gray-300: #D4D4D4;  /* Primary text */
--gray-200: #E5E5E5;  /* High contrast text */
--gray-100: #F5F5F5;  /* Pure white (rarely used) */

/* Brand - Deep Blue */
--blue-900: #0C1E35;  /* Dark blue backgrounds */
--blue-800: #0C2340;  /* Primary brand color */
--blue-700: #1E3A5F;  /* Hover states */
--blue-600: #2E4A6F;  /* Active states */
--blue-500: #3E5A7F;  /* Accents */
--blue-400: #5E7A9F;  /* Lighter accents */

/* Accent - Titanium Silver */
--silver-900: #707078;  /* Dark silver */
--silver-800: #8E8E93;  /* Medium silver */
--silver-700: #AEAEB2;  /* Base silver */
--silver-600: #C0C0C8;  /* Primary silver */
--silver-500: #D1D1D6;  /* Light silver */
--silver-400: #E8E8ED;  /* Subtle highlight */

/* Semantic Colors */
--success: #10B981;   /* Green for completed actions */
--warning: #F59E0B;   /* Amber for warnings */
--error: #EF4444;     /* Red for errors */
--info: #3B82F6;      /* Blue for info */
```

### Usage Guidelines

**Backgrounds:**
- App background: `--gray-950` (pure black)
- Cards/modules: `--gray-900`
- Elevated surfaces (modals): `--gray-800`
- Subtle elevation: `--gray-800` with 2px border of `--gray-700`

**Text:**
- Primary text: `--gray-200` (high contrast, 16px+)
- Secondary text: `--gray-400` (body copy, 14px)
- Subtle text: `--gray-500` (timestamps, meta, 12px)
- Disabled: `--gray-600`

**Interactive Elements:**
- Primary CTA: `--blue-800` background, `--gray-100` text
- Primary CTA hover: `--blue-700`
- Secondary CTA: `--gray-800` background, `--gray-200` text
- Secondary hover: `--gray-700`
- Links: `--blue-400`
- Focus states: 2px `--blue-500` outline

**Accents:**
- Use silver for highlights: badges, premium indicators, interactive elements
- Silver for primary accent color on buttons and CTAs
- Silver works best with subtle gradients for depth
- Conveys sophistication and precision without ostentation

---

## Typography

### Font Stack

```css
/* Serif Font - For Headlines & Titles */
--font-serif: 'Playfair Display', Georgia, serif;

/* Primary Font - SF Pro / System Fonts */
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
                'Helvetica Neue', Arial, sans-serif;

/* Monospace - for code/data */
--font-mono: 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
```

**Rationale:**
- **Playfair Display (Serif)** - Premium, elegant feel for all headings and titles. Conveys sophistication and executive-level quality.
- **System Fonts** - Native to each platform (no download needed), excellent readability for body text, professional feel.
- **SF Mono** - For code snippets and data display.

### Type Scale

```css
/* Display - Hero headlines */
--text-display: 72px / 1.1 / -0.02em / 700;

/* Heading 1 - Page titles */
--text-h1: 48px / 1.2 / -0.01em / 700;

/* Heading 2 - Section titles */
--text-h2: 32px / 1.3 / -0.01em / 600;

/* Heading 3 - Sub-sections */
--text-h3: 24px / 1.4 / 0 / 600;

/* Heading 4 - Card titles */
--text-h4: 20px / 1.4 / 0 / 600;

/* Body Large - Important body text */
--text-lg: 18px / 1.6 / 0 / 400;

/* Body - Default body text */
--text-base: 16px / 1.6 / 0 / 400;

/* Body Small - Secondary text */
--text-sm: 14px / 1.5 / 0 / 400;

/* Caption - Metadata, timestamps */
--text-xs: 12px / 1.4 / 0 / 400;

/* Tiny - Legal, ultra-small */
--text-2xs: 10px / 1.4 / 0 / 400;
```

**Format:** `size / line-height / letter-spacing / font-weight`

### Typography Guidelines

**Headlines:**
- **Always use serif font (Playfair Display)** for H1, H2, H3 titles
- Use sentence case, not title case
- Keep headlines short (max 40 characters)
- Never use all caps in headlines
- Line height: 1.2-1.3 for headings
- Font weights: 500-700 for headings

**Body Text:**
- Optimal line length: 50-75 characters
- Use 16px minimum for body text
- Increase line height for longer text blocks
- Left-align only (never center body text)

**Emphasis:**
- **Bold** for primary emphasis
- *Italic* for subtle emphasis (rare)
- Avoid underline except for links
- Use color sparingly for emphasis

**Accessibility:**
- WCAG AAA contrast for all text
- Never use text smaller than 12px
- Avoid pure white (#FFF) on pure black (#000)
- Use `--gray-200` on `--gray-950` instead

---

## Spacing System

### 8pt Grid System

All spacing uses multiples of 8px for visual consistency and rhythm.

```css
--space-1: 4px;    /* 0.5 unit - Tiny gaps */
--space-2: 8px;    /* 1 unit - Small gaps */
--space-3: 12px;   /* 1.5 units - Compact spacing */
--space-4: 16px;   /* 2 units - Default gap */
--space-5: 20px;   /* 2.5 units - Comfortable gap */
--space-6: 24px;   /* 3 units - Section spacing */
--space-8: 32px;   /* 4 units - Large spacing */
--space-10: 40px;  /* 5 units - Extra large */
--space-12: 48px;  /* 6 units - Page margins */
--space-16: 64px;  /* 8 units - Hero spacing */
--space-20: 80px;  /* 10 units - Section dividers */
--space-24: 96px;  /* 12 units - Page sections */
```

### Application

**Component Internal Spacing:**
- Button padding: `12px 24px` (`--space-3` `--space-6`)
- Card padding: `16px` (`--space-4`) mobile, `24px` (`--space-6`) desktop
- Input padding: `12px 16px` (`--space-3` `--space-4`)

**Layout Spacing:**
- Stack gap (vertical): `16px` (`--space-4`)
- Grid gap: `16px` (`--space-4`) mobile, `24px` (`--space-6`) desktop
- Page margins: `16px` (`--space-4`) mobile, `48px` (`--space-12`) desktop
- Section spacing: `64px` (`--space-16`) between major sections

---

## Component Library

### Buttons

#### Primary Button (CTA)
```css
.btn-primary {
  background: var(--blue-800);
  color: var(--gray-100);
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 150ms ease;
  border: none;
  box-shadow: 0 2px 8px rgba(12, 35, 64, 0.3);
}

.btn-primary:hover {
  background: var(--blue-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(12, 35, 64, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(12, 35, 64, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: var(--gray-800);
  color: var(--gray-200);
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid var(--gray-700);
  transition: all 150ms ease;
}

.btn-secondary:hover {
  background: var(--gray-700);
  border-color: var(--gray-600);
}
```

#### Ghost Button (Subtle)
```css
.btn-ghost {
  background: transparent;
  color: var(--gray-300);
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  transition: all 150ms ease;
}

.btn-ghost:hover {
  background: var(--gray-800);
}
```

**Usage:**
- Primary: Main actions (Send message, Book session)
- Secondary: Alternative actions (Cancel, Back)
- Ghost: Tertiary actions (View details, Settings)

### Cards

#### Standard Card
```css
.card {
  background: var(--gray-900);
  border: 1px solid var(--gray-800);
  border-radius: 16px;
  padding: 24px;
  transition: all 200ms ease;
}

.card:hover {
  border-color: var(--gray-700);
  transform: translateY(-2px);
}
```

#### Elevated Card (Modal)
```css
.card-elevated {
  background: var(--gray-800);
  border: 1px solid var(--gray-700);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
```

### Inputs

#### Text Input
```css
.input {
  background: var(--gray-900);
  border: 1px solid var(--gray-700);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  color: var(--gray-200);
  transition: all 150ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--blue-500);
  box-shadow: 0 0 0 3px rgba(46, 74, 111, 0.2);
}

.input::placeholder {
  color: var(--gray-500);
}
```

#### Textarea (Chat Input)
```css
.textarea {
  background: var(--gray-900);
  border: 1px solid var(--gray-700);
  border-radius: 16px;
  padding: 16px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray-200);
  resize: none;
  min-height: 80px;
  transition: all 150ms ease;
}

.textarea:focus {
  outline: none;
  border-color: var(--blue-500);
  box-shadow: 0 0 0 3px rgba(46, 74, 111, 0.2);
}
```

### Chat Bubbles

#### User Message
```css
.message-user {
  background: var(--blue-800);
  color: var(--gray-100);
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
  max-width: 80%;
  margin-left: auto;
  font-size: 16px;
  line-height: 1.5;
}
```

#### Coach Message
```css
.message-coach {
  background: var(--gray-800);
  color: var(--gray-200);
  padding: 12px 16px;
  border-radius: 18px 18px 18px 4px;
  max-width: 80%;
  margin-right: auto;
  font-size: 16px;
  line-height: 1.5;
  border: 1px solid var(--gray-700);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-premium {
  background: linear-gradient(135deg, var(--gold-700), var(--gold-600));
  color: var(--gray-950);
}

.badge-success {
  background: var(--success);
  color: white;
}
```

---

## Iconography

### Icon System

**Style:** Outline icons (2px stroke weight)  
**Size:** 20px, 24px, 28px, 32px  
**Library:** Lucide Icons (React) or SF Symbols (native)  
**Color:** Inherit from parent element

**Usage Guidelines:**
- Use icons to reinforce meaning, not replace text
- Pair icons with labels for primary actions
- Icon-only buttons: 44x44px minimum (accessibility)
- Consistent icon family throughout app

**Key Icons:**

| Action | Icon | Usage |
|--------|------|-------|
| Voice | Microphone | Start/stop voice recording |
| Text | MessageSquare | Switch to text mode |
| Send | Send | Submit message |
| Book Session | Calendar | Schedule coaching session |
| Goals | Target | View/edit goals |
| History | Clock | View past conversations |
| Settings | Settings | App settings |
| Profile | User | User profile |

---

## Animation & Motion

### Principles

1. **Purposeful:** Every animation has a reason (feedback, guide attention, delight)
2. **Fast:** Keep animations under 300ms for interactions
3. **Natural:** Use easing functions that mimic physics
4. **Subtle:** Prefer micro-interactions over flashy effects

### Timing Functions

```css
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);    /* Default exit */
--ease-in: cubic-bezier(0.32, 0, 0.67, 0);     /* Default enter */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* Smooth both */
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Bounce effect */
```

### Animation Durations

```css
--duration-instant: 100ms;   /* Hover states, focus */
--duration-fast: 150ms;      /* Button clicks */
--duration-normal: 200ms;    /* Default transitions */
--duration-slow: 300ms;      /* Page transitions */
--duration-slower: 500ms;    /* Modal enter/exit */
```

### Common Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 200ms var(--ease-out);
}
```

#### Slide Up (Bottom Sheet)
```css
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-up {
  animation: slideUp 300ms var(--ease-out);
}
```

#### Scale In (Modal)
```css
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.scale-in {
  animation: scaleIn 200ms var(--ease-out);
}
```

#### Pulse (Voice Recording)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.pulse {
  animation: pulse 1.5s infinite;
}
```

---

## Layout & Grid

### Mobile Layout (< 768px)

**Container:**
- Max width: 100vw
- Padding: `16px` (--space-4)
- Safe area insets: Respect iOS notch and home indicator

**Stack Layout (Vertical):**
```css
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px; /* --space-4 */
}
```

**Navigation:**
- Bottom tab bar (fixed)
- 5 items max
- 56px height
- Safe area padding at bottom

### Desktop Layout (≥ 768px)

**Container:**
- Max width: 1200px
- Padding: `48px` (--space-12)
- Centered

**Two-Column Layout:**
```css
.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px; /* --space-6 */
}
```

**Sidebar + Main:**
```css
.sidebar-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px; /* --space-8 */
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

### Mobile Optimizations

**Touch Targets:**
- Minimum 44x44px (Apple HIG)
- 48x48px preferred (Android Material)
- Extra padding around interactive elements

**Typography:**
- 16px minimum for body text (prevents zoom on iOS)
- Larger text for primary actions (18px+)
- Adjust line height for mobile (1.6 for body)

**Thumb Zones:**
- Primary actions in bottom 1/3 of screen
- Natural thumb reach: Bottom corners
- Avoid top-left corner for frequent actions

---

## Voice UI Patterns

### Voice Recording State

**Idle State:**
```
┌─────────────────────────┐
│                         │
│     [Microphone Icon]   │
│     "Tap to speak"      │
│                         │
└─────────────────────────┘
```

**Recording State:**
```
┌─────────────────────────┐
│   [Animated Waveform]   │
│   ●  Recording...       │
│   [Stop Button]         │
└─────────────────────────┘
```

**Processing State:**
```
┌─────────────────────────┐
│   [Spinner Animation]   │
│   "Processing..."       │
└─────────────────────────┘
```

### Voice Waveform

- Real-time waveform visualization
- Color: `--blue-500` gradient
- Smooth animation (60fps)
- Amplitude based on volume

---

## Loading States

### Skeleton Screens

**Principle:** Show layout structure while loading

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-900) 0%,
    var(--gray-800) 50%,
    var(--gray-900) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**Usage:**
- Conversation list loading
- Message history loading
- Profile loading

### Spinners

**Principle:** For short waits (<3 seconds)

```css
.spinner {
  border: 3px solid var(--gray-800);
  border-top-color: var(--blue-500);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Progress Indicators

**For longer operations (onboarding, processing):**

```css
.progress-bar {
  background: var(--gray-800);
  border-radius: 100px;
  height: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  background: linear-gradient(90deg, var(--blue-700), var(--blue-500));
  height: 100%;
  border-radius: 100px;
  transition: width 300ms ease;
}
```

---

## Empty States

### No Conversations Yet

```
┌─────────────────────────┐
│    [Coach Icon Large]   │
│                         │
│  "Start your first"     │
│  "conversation"         │
│                         │
│  [Primary Button]       │
│  "Begin Check-in"       │
└─────────────────────────┘
```

### No Upcoming Sessions

```
┌─────────────────────────┐
│   [Calendar Icon]       │
│                         │
│  "No sessions booked"   │
│  "Schedule a deep dive" │
│                         │
│  [Secondary Button]     │
│  "Book Session"         │
└─────────────────────────┘
```

**Principles:**
- Friendly, encouraging tone
- Clear next action
- Illustrative icon (not decorative)
- Never leave user stuck

---

## Micro-interactions

### Button Press Feedback

```css
.btn:active {
  transform: scale(0.98);
}
```

### Checkbox Toggle

```css
.checkbox {
  transition: all 150ms ease;
}

.checkbox:checked {
  background: var(--blue-800);
  transform: scale(1.05);
}
```

### Toast Notifications

**Slide in from top:**
```css
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast {
  animation: slideDown 300ms var(--ease-out);
}
```

**Auto-dismiss after 4 seconds:**
```css
.toast {
  animation: 
    slideDown 300ms var(--ease-out),
    fadeOut 300ms 3.7s var(--ease-in) forwards;
}
```

---

## Accessibility

### Color Contrast

- **WCAG AAA Required:** 7:1 for normal text, 4.5:1 for large text
- Test all color combinations
- Never rely on color alone (use icons + text)

### Focus States

**Always visible focus indicators:**
```css
*:focus-visible {
  outline: 2px solid var(--blue-500);
  outline-offset: 2px;
}
```

### Screen Reader Support

- Semantic HTML (nav, main, article, aside)
- ARIA labels for icon-only buttons
- Alt text for all images
- Skip navigation links

### Keyboard Navigation

- All interactive elements focusable
- Logical tab order (top to bottom, left to right)
- Escape key closes modals
- Enter/Space activates buttons

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Platform-Specific Considerations

### iOS

- **Safe Area:** Respect notch and home indicator
- **Haptic Feedback:** Use sparingly for confirmations
- **Swipe Gestures:** Swipe back to go back
- **Bottom Sheet:** Native iOS feel (rounded corners, drag indicator)

### Android

- **Material Design:** Respect platform conventions where relevant
- **Back Button:** Hardware back button support
- **FAB:** Floating action buttons feel native on Android
- **Snackbar:** Use for temporary messages

### Web (PWA)

- **Installability:** "Add to Home Screen" prompt
- **Offline Support:** Graceful degradation
- **Push Notifications:** Request permission contextually
- **Responsive:** Works on any screen size

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-bg-primary: #0A0A0A;
  --color-bg-secondary: #1A1A1A;
  --color-bg-elevated: #2D2D2D;
  
  --color-text-primary: #E5E5E5;
  --color-text-secondary: #A3A3A3;
  --color-text-subtle: #737373;
  
  --color-brand: #0C2340;
  --color-accent: #B8A582;
  
  /* Spacing */
  --space-unit: 8px;
  --space-xs: calc(var(--space-unit) * 0.5);
  --space-sm: var(--space-unit);
  --space-md: calc(var(--space-unit) * 2);
  --space-lg: calc(var(--space-unit) * 3);
  --space-xl: calc(var(--space-unit) * 4);
  
  /* Typography */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  
  /* Borders */
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --border-radius-xl: 20px;
  --border-radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.6);
}
```

---

## Do's and Don'ts

###  Do

- **Use generous whitespace** - Let the design breathe
- **Prioritize readability** - Text should be effortless to read
- **Provide instant feedback** - Every action gets a response
- **Design for one-handed use** - Bottom-weighted interface
- **Use consistent patterns** - Don't reinvent the wheel
- **Test in dark environments** - Avoid pure white (#FFF)

###  Don't

- **Overuse gold accents** - Use sparingly for premium feel
- **Use thin fonts** - Always 400+ weight for body text
- **Flash or blink** - No aggressive animations
- **Center-align body text** - Always left-align paragraphs
- **Use carousel/sliders** - Users don't interact with them
- **Auto-play videos** - Respect bandwidth and attention

---

## Shipped Features ✅

**November 2025 Launch:**
- ✅ **Serif Typography** - Playfair Display for all headings
- ✅ **Data Visualization** - Coaching growth journey chart with Recharts
- ✅ **Dynamic Icons** - Auto-generated favicon, apple-icon, OG images
- ✅ **Password Reset Flow** - Complete with show/hide toggles
- ✅ **SEO Optimization** - llms.txt, sitemap, robots.txt, complete metadata
- ✅ **PWA Support** - Installable app with manifest and service worker
- ✅ **Dashboard Redesign** - Growth chart at top with serif titles

## Future Design Explorations

### Phase 2

- **Dark/Light mode toggle** - Add light mode option
- **Custom themes** - User-selectable color schemes
- **Voice visualizations** - Advanced waveform animations
- **Achievement system** - Celebrate milestones (subtle)
- **Advanced analytics** - More detailed progress tracking

### Phase 3

- **Coach avatars** - Visual representation of coach
- **3D elements** - Subtle depth (iOS-style)
- **Advanced animations** - Lottie animations for delight
- **Branded merchandise** - Physical goods for super fans

---

## Resources

### Design Tools
- **Figma** - Primary design tool
- **Principle** - Prototyping animations
- **SF Symbols** - iOS icon library
- **Lucide Icons** - Web icon library

### Inspiration
- **Apple HIG** - iOS design standards
- **Material Design** - Android conventions
- **Linear** - Clean, fast app design
- **Mercury** - Premium financial app
- **Stripe** - Developer-focused UI

### Type Foundries
- **San Francisco** - Apple (free)
- **Inter** - Rasmus Andersson (free)
- **Söhne** - Klim Type Foundry (paid, future consideration)

---

**Document Owner:** Paul  
**Design Lead:** TBD (Paul for MVP)  
**Next Review:** After first user testing
