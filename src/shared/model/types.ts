export interface IPageProps<T, K> {
  params: Promise<{ locale: string } & T>;
  searchParams: Promise<K>;
}

export interface ILayoutProps<T> {
  params: Promise<{ locale: string } & T>;
}
