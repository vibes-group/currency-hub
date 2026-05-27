import {
  Link as RouterLink,
  useLocation,
  useNavigate,
  type LinkProps as RouterLinkProps,
} from 'react-router';

type LinkProps = Omit<RouterLinkProps, 'to'> & {
  href: string;
};

export function Link({ href, ...props }: LinkProps) {
  return <RouterLink to={href} {...props} />;
}

export function usePathname() {
  const location = useLocation();

  return location.pathname;
}

export function useRouter() {
  const navigate = useNavigate();

  return {
    replace(pathname: string) {
      navigate(pathname, { replace: true });
    },
    push(pathname: string) {
      navigate(pathname);
    },
  };
}
