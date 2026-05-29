import { useTranslations } from '@/i18n';
import { DownloadIcon } from '@/shared/icons';
import { Button } from '@/shared/ui';

import { useInstallPwaPrompt } from '../model/install-pwa';

export function InstallPwaButton() {
  const t = useTranslations('InstallPwa');
  const { canInstall, install } = useInstallPwaPrompt();

  if (!canInstall) {
    return null;
  }

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
