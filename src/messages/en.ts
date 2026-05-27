import ru from './ru';

const en: typeof ru = {
  LocaleToggle: {
    label: 'Language',
    ru: 'Russian',
    en: 'English',
  },
  ThemeToggle: {
    label: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },
  Demo: {
    badge: 'UI foundation',
    title: 'Currency Hub primitives',
    description:
      'Tailwind tokens and shadcn primitives adapted to the mobile currency design language.',
    mobilePreviewButton: 'Mobile preview',
    tokensTitle: 'Tokens',
    tokensDescription:
      'Core CSS variables exposed as Tailwind v4 theme tokens.',
    buttonsTitle: 'Buttons',
    controlsTitle: 'Controls',
    searchPlaceholder: 'Search currency or code',
    button: {
      primary: 'Primary',
      secondary: 'Secondary',
      outline: 'Outline',
      ghost: 'Ghost',
      destructive: 'Destructive',
      extraSmall: 'Extra small',
      small: 'Small',
      default: 'Default',
      large: 'Large',
      disabled: 'Disabled',
    },
    tokens: {
      background: 'Background',
      card: 'Card',
      primary: 'Primary',
      accentSoft: 'Accent soft',
      muted: 'Muted',
      border: 'Border',
      warning: 'Warning',
      danger: 'Danger',
    },
    cards: {
      rateTitle: 'Rate card',
      rateDescription: 'Compact financial metric',
      live: 'Live',
      updated: 'Updated 18 sec ago',
      offlineTitle: 'Offline state',
      offlineDescription: 'Cached data fallback',
      stale: 'Stale',
      indexedDb: 'IndexedDB',
      offlineBody:
        'Last cached rates remain readable when the device is offline.',
      retrySync: 'Retry sync',
      loadingTitle: 'Loading state',
      loadingDescription: 'Skeleton primitives',
      pending: 'Pending',
    },
    preview: {
      mobileTitle: 'Mobile preview',
      darkTitle: 'Dark preview',
      subtitle: 'Mobile PWA foundation',
      amount: 'Amount',
      settings: 'Settings',
      refreshRate: 'Refresh rate',
      cachedRate: 'Cached exchange rate',
      target: 'Target',
    },
  },
};

export default en;
