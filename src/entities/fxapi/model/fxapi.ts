export type FxapiCurrencyCode = string;
export type FxapiDate = string;
export type FxapiDateTimestamp = string;

export type FxapiPairRateResponse = {
  base: FxapiCurrencyCode;
  target: FxapiCurrencyCode;
  rate: number;
  timestamp: FxapiDateTimestamp;
};

export type FxapiLatestRatesResponse = {
  base: FxapiCurrencyCode;
  timestamp: FxapiDateTimestamp;
  rates: Record<FxapiCurrencyCode, number>;
};

export type FxapiCurrenciesResponse = {
  count: number;
  currencies: FxapiCurrencyCode[];
  timestamp: FxapiDateTimestamp;
};

export type FxapiHistoryStats = {
  open: number;
  close: number;
  high: number;
  low: number;
  average: number;
  change: number;
  change_pct: number;
};

export type FxapiHistoryRate = {
  date: FxapiDate;
  rate: number;
};

export type FxapiHistoryRangeResponse = {
  base: FxapiCurrencyCode;
  target: FxapiCurrencyCode;
  from: FxapiDate;
  to: FxapiDate;
  count: number;
  stats: FxapiHistoryStats;
  rates: FxapiHistoryRate[];
};

export type FxapiHistoryDateResponse = {
  base: FxapiCurrencyCode;
  target: FxapiCurrencyCode;
  date: FxapiDate;
  rate: number;
};

export type FxapiFeedbackRequest = {
  message: string;
  page?: string;
  token: string;
};

export type FxapiFeedbackResponse = {
  ok: boolean;
};

export type FxapiHistoryRangeRequest = {
  from: FxapiDate;
  to?: FxapiDate;
  tz?: string;
};
