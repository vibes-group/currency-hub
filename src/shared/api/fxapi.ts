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

export function getLatestRates(base = "USD") {
  return fxapiClient.get<FxapiRatesResponse>(`/${base.toUpperCase()}.json`);
}

export function getPairRate(base: string, target: string) {
  return fxapiClient.get<FxapiPairResponse>(
    `/${base.toUpperCase()}/${target.toUpperCase()}.json`,
  );
}

export function getCurrencies() {
  return fxapiClient.get<FxapiCurrenciesResponse>("/currencies.json");
}
