import { ApiClient, ReqConfig } from '@/shared/api';

import type {
  FxapiCurrenciesResponse,
  FxapiCurrencyCode,
  FxapiDate,
  FxapiFeedbackRequest,
  FxapiFeedbackResponse,
  FxapiHistoryDateResponse,
  FxapiHistoryRangeRequest,
  FxapiHistoryRangeResponse,
  FxapiLatestRatesResponse,
  FxapiPairRateResponse,
} from '../model/fxapi';

function normalizeCurrencyCode(code: string) {
  return code.trim().toUpperCase();
}

export class FxapiService {
  constructor(private readonly apiClient: ApiClient) {}

  getPairRate(
    base: FxapiCurrencyCode,
    target: FxapiCurrencyCode,
    config?: ReqConfig,
  ) {
    return this.apiClient.get<FxapiPairRateResponse>(
      `/${normalizeCurrencyCode(base)}/${normalizeCurrencyCode(target)}.json`,
      config,
    );
  }

  getLatestRates(base: FxapiCurrencyCode, config?: ReqConfig) {
    return this.apiClient.get<FxapiLatestRatesResponse>(
      `/${normalizeCurrencyCode(base)}.json`,
      config,
    );
  }

  getCurrencies(config?: ReqConfig) {
    return this.apiClient.get<FxapiCurrenciesResponse>(
      '/currencies.json',
      config,
    );
  }

  getHistoryRange(
    base: FxapiCurrencyCode,
    target: FxapiCurrencyCode,
    { from, to, tz }: FxapiHistoryRangeRequest,
    config?: ReqConfig,
  ) {
    return this.apiClient.get<FxapiHistoryRangeResponse>(
      `/history/${normalizeCurrencyCode(base)}/${normalizeCurrencyCode(
        target,
      )}.json`,
      {
        ...config,
        query: { ...config?.query, from, to, tz },
      },
    );
  }

  getHistoryDate(
    base: FxapiCurrencyCode,
    target: FxapiCurrencyCode,
    date: FxapiDate,
    config?: ReqConfig,
  ) {
    return this.apiClient.get<FxapiHistoryDateResponse>(
      `/history/${normalizeCurrencyCode(base)}/${normalizeCurrencyCode(
        target,
      )}/${date}.json`,
      config,
    );
  }

  submitFeedback(body: FxapiFeedbackRequest, config?: ReqConfig) {
    return this.apiClient.post<FxapiFeedbackResponse>(
      '/feedback',
      body,
      config,
    );
  }
}

export const fxapiService = new FxapiService(
  new ApiClient({
    baseUrl: 'https://fxapi.app/api',
  }),
);
