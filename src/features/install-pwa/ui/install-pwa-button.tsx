import { useTranslations } from '@/i18n';
import { DownloadIcon } from '@/shared/icons';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui';

import { useInstallPwaPrompt } from '../model/install-pwa';
import type { PwaInstallGuide } from '../model/install-pwa';

function getGuideKey({ device, browser }: PwaInstallGuide) {
  if (device === 'ios') {
    return browser === 'safari' ? 'iosSafari' : 'iosChrome';
  }

  if (device === 'android') {
    return browser === 'firefox' ? 'androidFirefox' : 'androidChrome';
  }

  return browser === 'safari' ? 'desktopSafari' : 'desktop';
}

export function InstallPwaButton() {
  const t = useTranslations('InstallPwa');
  const {
    canShowInstallAction,
    hasNativeInstallPrompt,
    install,
    installGuide,
  } = useInstallPwaPrompt();
  const guideKey = getGuideKey(installGuide);

  if (!canShowInstallAction) {
    return null;
  }

  if (hasNativeInstallPrompt) {
    return (
      <Button
        aria-label={t('label')}
        size="icon"
        type="button"
        variant="secondary"
        onClick={install}
      >
        <DownloadIcon />
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label={t('label')}
          size="icon"
          type="button"
          variant="secondary"
        >
          <DownloadIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(`${guideKey}.title`)}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted-foreground">
          <li>{t(`${guideKey}.step1`)}</li>
          <li>{t(`${guideKey}.step2`)}</li>
          <li>{t(`${guideKey}.step3`)}</li>
        </ol>
        <DialogFooter>
          <DialogClose asChild>
            <Button>{t('done')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
