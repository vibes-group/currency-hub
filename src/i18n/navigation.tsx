import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  type LinkProps as RouterLinkProps,
} from 'react-router';

import { useLocale } from './provider';
import { type Locale, stripLocale, withLocale } from './routing';

type LinkProps = Omit<RouterLinkProps, 'to'> & {
  href: string;
};

export function Link({ href, ...props }: LinkProps) {
  const locale = useLocale();

  return <RouterLink to={withLocale(href, locale)} {...props} />;
}

export function usePathname() {
  const location = useLocation();

  return stripLocale(location.pathname);
}

export function useRouter() {
  const navigate = useNavigate();

  return {
    replace(pathname: string, options?: { locale?: Locale }) {
      const targetLocale = options?.locale;

      navigate(targetLocale ? withLocale(pathname, targetLocale) : pathname, {
        replace: true,
      });
    },
    push(pathname: string, options?: { locale?: Locale }) {
      const targetLocale = options?.locale;

      navigate(targetLocale ? withLocale(pathname, targetLocale) : pathname);
    },
  };
}
