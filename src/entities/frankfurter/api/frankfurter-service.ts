import { ApiClient, type ReqConfig } from '@/shared/api';

import type {
  FrankfurterCurrenciesRequest,
  FrankfurterCurrency,
  FrankfurterCurrencyCode,
  FrankfurterCurrencyDetail,
  FrankfurterLatestRatesResponse,
  FrankfurterPairRateRequest,
  FrankfurterProvider,
  FrankfurterRate,
  FrankfurterRatesRequest,
} from '../model/frankfurter';

function normalizeCurrencyCode(code: string) {
  return code.trim().toUpperCase();
}

function joinQueryList(values?: string[]) {
  return values?.map((value) => value.trim()).filter(Boolean).join(',');
}

function dateToTimestamp(date: string | undefined) {
  return date ? `${date}T00:00:00.000Z` : new Date().toISOString();
}

function getLatestDate(rows: FrankfurterRate[]) {
  return rows.reduce<string | undefined>((latestDate, row) => {
    if (!latestDate || row.date > latestDate) {
      return row.date;
    }

    return latestDate;
  }, undefined);
}

export class FrankfurterService {
  constructor(private readonly apiClient: ApiClient) {}

  async getLatestRates(
    base: FrankfurterCurrencyCode,
    config?: ReqConfig,
  ): Promise<FrankfurterLatestRatesResponse> {
    const normalizedBase = normalizeCurrencyCode(base);
    const rows = await this.getRates({ base: normalizedBase }, config);
    const rates = rows.reduce<Record<FrankfurterCurrencyCode, number>>(
      (acc, row) => {
        acc[normalizeCurrencyCode(row.quote)] = row.rate;
        return acc;
      },
      {
        [normalizedBase]: 1,
      },
    );

    return {
      base: normalizedBase,
      timestamp: dateToTimestamp(getLatestDate(rows)),
      rates,
    };
  }

  getRates(
    {
      date,
      from,
      to,
      base,
      quotes,
      providers,
      group,
      expand,
    }: FrankfurterRatesRequest = {},
    config?: ReqConfig,
  ) {
    return this.apiClient.get<FrankfurterRate[]>('/rates', {
      ...config,
      query: {
        ...config?.query,
        date,
        from,
        to,
        base: base ? normalizeCurrencyCode(base) : undefined,
        quotes: joinQueryList(quotes?.map(normalizeCurrencyCode)),
        providers: joinQueryList(providers),
        group,
        expand,
      },
    });
  }

  getPairRate(
    base: FrankfurterCurrencyCode,
    quote: FrankfurterCurrencyCode,
    { date, providers }: FrankfurterPairRateRequest = {},
    config?: ReqConfig,
  ) {
    return this.apiClient.get<FrankfurterRate>(
      `/rate/${normalizeCurrencyCode(base)}/${normalizeCurrencyCode(quote)}`,
      {
        ...config,
        query: {
          ...config?.query,
          date,
          providers: joinQueryList(providers),
        },
      },
    );
  }

  getCurrencies(
    { scope, providers }: FrankfurterCurrenciesRequest = {},
    config?: ReqConfig,
  ) {
    return this.apiClient.get<FrankfurterCurrency[]>('/currencies', {
      ...config,
      query: {
        ...config?.query,
        scope,
        providers: joinQueryList(providers),
      },
    });
  }

  getCurrency(code: FrankfurterCurrencyCode, config?: ReqConfig) {
    return this.apiClient.get<FrankfurterCurrencyDetail>(
      `/currency/${normalizeCurrencyCode(code)}`,
      config,
    );
  }

  getProviders(config?: ReqConfig) {
    return this.apiClient.get<FrankfurterProvider[]>('/providers', config);
  }
}

export const frankfurterService = new FrankfurterService(
  new ApiClient({
    baseUrl: 'https://api.frankfurter.dev/v2',
  }),
);
