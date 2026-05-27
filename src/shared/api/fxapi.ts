import { ApiClient } from "./core";

export type FxapiRatesResponse = {
  base: string;
  timestamp: string;
  rates: Record<string, number>;
};

export type FxapiPairResponse = {
  base: string;
  target: string;
  rate: number;
  timestamp: string;
};

export type FxapiCurrenciesResponse = string[] | Record<string, unknown>;

export const fxapiClient = new ApiClient({
  baseUrl: "https://fxapi.app/api",
});

export function getLatestRates(base = "USD", signal?: AbortSignal) {
  return fxapiClient.get<FxapiRatesResponse>(`/${base.toUpperCase()}.json`, {
    signal,
  });
}

export function getPairRate(base: string, target: string, signal?: AbortSignal) {
  return fxapiClient.get<FxapiPairResponse>(
    `/${base.toUpperCase()}/${target.toUpperCase()}.json`,
    { signal },
  );
}

export function getCurrencies(signal?: AbortSignal) {
  return fxapiClient.get<FxapiCurrenciesResponse>("/currencies.json", {
    signal,
  });
}
