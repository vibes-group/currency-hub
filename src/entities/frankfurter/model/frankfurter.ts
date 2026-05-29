export type FrankfurterCurrencyCode = string;
export type FrankfurterDate = string;

export type FrankfurterRateProvider = {
  key: string;
  rate: number;
  excluded?: boolean;
};

export type FrankfurterRate = {
  date: FrankfurterDate;
  base: FrankfurterCurrencyCode;
  quote: FrankfurterCurrencyCode;
  rate: number;
  providers?: FrankfurterRateProvider[];
};

export type FrankfurterLatestRatesResponse = {
  base: FrankfurterCurrencyCode;
  timestamp: string;
  rates: Record<FrankfurterCurrencyCode, number>;
};

export type FrankfurterCurrency = {
  iso_code: FrankfurterCurrencyCode;
  iso_numeric?: string | null;
  name: string;
  symbol?: string | null;
  start_date?: FrankfurterDate | null;
  end_date?: FrankfurterDate | null;
};

export type FrankfurterCurrencyDetail = FrankfurterCurrency & {
  providers?: string[];
  peg?: {
    base: FrankfurterCurrencyCode;
    rate: number;
    authority?: string;
    source?: string;
  };
};

export type FrankfurterProvider = {
  key: string;
  name: string;
  country_code?: string | null;
  rate_type?: string | null;
  pivot_currency?: FrankfurterCurrencyCode | null;
  data_url?: string | null;
  terms_url?: string | null;
  start_date?: FrankfurterDate | null;
  end_date?: FrankfurterDate | null;
  publishes_missed?: number | null;
  currencies: FrankfurterCurrencyCode[];
};

export type FrankfurterRatesRequest = {
  date?: FrankfurterDate;
  from?: FrankfurterDate;
  to?: FrankfurterDate;
  base?: FrankfurterCurrencyCode;
  quotes?: FrankfurterCurrencyCode[];
  providers?: string[];
  group?: 'week' | 'month';
  expand?: 'providers';
};

export type FrankfurterPairRateRequest = {
  date?: FrankfurterDate;
  providers?: string[];
};

export type FrankfurterCurrenciesRequest = {
  scope?: 'all';
  providers?: string[];
};
