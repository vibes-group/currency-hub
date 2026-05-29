import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export type PwaInstallGuide = {
  device: 'ios' | 'android' | 'desktop';
  browser: 'safari' | 'chrome' | 'edge' | 'firefox' | 'other';
};

function isStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && navigator.standalone === true)
  );
}

function detectInstallGuide(): PwaInstallGuide {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const isIos =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(userAgent);
  const isEdge = /Edg\//.test(userAgent);
  const isFirefox = /Firefox|FxiOS/.test(userAgent);
  const isChrome = /Chrome|CriOS/.test(userAgent) && !isEdge;
  const isSafari =
    /Safari/.test(userAgent) && !isChrome && !isEdge && !isFirefox;

  return {
    device: isIos ? 'ios' : isAndroid ? 'android' : 'desktop',
    browser: isSafari
      ? 'safari'
      : isChrome
        ? 'chrome'
        : isEdge
          ? 'edge'
          : isFirefox
            ? 'firefox'
            : 'other',
  };
}

export function useInstallPwaPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(isStandaloneMode);
  const [installGuide, setInstallGuide] =
    useState<PwaInstallGuide>(detectInstallGuide);

  useEffect(() => {
    setIsStandalone(isStandaloneMode());
    setInstallGuide(detectInstallGuide());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return {
    canShowInstallAction: !isStandalone,
    hasNativeInstallPrompt: Boolean(installPrompt),
    installGuide,
    install,
  };
}
