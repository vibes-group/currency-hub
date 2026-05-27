/* eslint-disable @typescript-eslint/no-explicit-any */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Конфигурация HTTP-запроса
 * @interface RequestConfig
 * @extends {Omit<RequestInit, 'body' | 'signal' | 'method'>}
 */
interface RequestConfig extends Omit<
  RequestInit,
  'body' | 'signal' | 'method'
> {
  /** Относительный URL запроса (без baseUrl) */
  url: string;
  /** HTTP-метод запроса */
  method?: HttpMethod;
  /** Параметры query-строки (будут добавлены к URL после ?) */
  query?: Record<string, any>;
  /** Тело запроса (для POST, PUT, PATCH) */
  body?: any;
  /** Сигнал для отмены запроса (AbortController) */
  signal?: AbortSignal;
  /** Отключает определение языка */
  disableLocale?: boolean;
}

/**
 * Конфигурация ApiClient при создании экземпляра
 * @interface ApiClientConfig
 */
interface ApiClientConfig {
  /** Базовый URL API. Пример: 'https://api.example.com' */
  baseUrl?: string;
  /** Заголовки по умолчанию для всех запросов */
  headers?: Record<string, string>;
}

/**
 * Перехватчик запроса. Выполняется перед каждым запросом.
 * Позволяет модифицировать конфигурацию запроса (добавить токен, заголовки и т.д.)
 * @typedef {Function} RequestInterceptor
 * @param {RequestConfig} config - Конфигурация запроса
 * @returns {Promise<RequestConfig> | RequestConfig} Модифицированная конфигурация
 * @example
 * // Пример перехватчика для добавления токена авторизации
 * const authInterceptor = (config) => ({
 *   ...config,
 *   headers: {
 *     ...config.headers,
 *     'Authorization': `Bearer ${getToken()}`
 *   }
 * });
 */
type RequestInterceptor = (
  config: RequestConfig,
) => Promise<RequestConfig> | RequestConfig;

/**
 * Перехватчик ответа. Выполняется после получения ответа от сервера.
 * Позволяет трансформировать данные или обработать ошибки
 * @typedef {Function} ResponseInterceptor
 * @param {T} response - Данные ответа
 * @returns {Promise<T> | T} Трансформированные данные
 * @example
 * // Пример перехватчика для извлечения data из ответа
 * const dataExtractor = (response) => response?.data;
 */
type ResponseInterceptor<T = any> = (response: T) => Promise<T> | T;

// =====================
// HTTP CLIENT
// =====================

/**
 * HTTP-клиент для выполнения API-запросов с поддержкой перехватчиков
 *
 * @class ApiClient
 * @description Класс для выполнения HTTP-запросов с автоматической обработкой
 * базового URL, заголовков, перехватчиков запросов/ответов и ошибок
 *
 * @example
 * // Создание клиента
 * const api = new ApiClient({
 *   baseUrl: 'https://api.example.com',
 *   headers: { 'X-Custom-Header': 'value' }
 * });
 *
 * @example
 * // Добавление перехватчика запроса (например, для авторизации)
 * api.addRequestInterceptor(async (config) => ({
 *   ...config,
 *   headers: { ...config.headers, 'Authorization': `Bearer ${token}` }
 * }));
 *
 * @example
 * // Добавление перехватчика ответа (например, для извлечения data)
 * api.addResponseInterceptor((response) => response.data);
 *
 * @example
 * // GET-запрос
 * const users = await api.get<User[]>('/users');
 *
 * @example
 * // POST-запрос с параметрами
 * const newUser = await api.post<User>('/users', { name: 'John' });
 *
 * @example
 * // Запрос с query-параметрами
 * const filtered = await api.get<User[]>('/users', { query: { limit: 10, offset: 0 } });
 *
 * @example
 * // Запрос с сигналом отмены
 * const controller = new AbortController();
 * const result = await api.get('/slow-endpoint', { signal: controller.signal });
 * // Чтобы отменить: controller.abort();
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  /**
   * Создает экземпляр ApiClient
   * @param {ApiClientConfig} config - Конфигурация клиента
   * @example
   * const client = new ApiClient({
   *   baseUrl: 'https://api.example.com',
   *   headers: { 'Content-Type': 'application/json' }
   * });
   */
  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.defaultHeaders = config.headers || {};
  }

  // =====================
  // INTERCEPTORS
  // =====================

  /**
   * Добавляет перехватчик запроса
   * Перехватчики выполняются в порядке добавления перед каждым запросом
   *
   * @method addRequestInterceptor
   * @param {RequestInterceptor} interceptor - Функция перехватчика
   * @returns {void}
   *
   * @example
   * // Добавление токена авторизации
   * api.addRequestInterceptor(async (config) => ({
   *   ...config,
   *   headers: {
   *     ...config.headers,
   *     'Authorization': `Bearer ${getAuthToken()}`
   *   }
   * }));
   *
   * @example
   * // Добавление логирования
   * api.addRequestInterceptor((config) => {
   *   console.log(`[REQUEST] ${config.method} ${config.url}`);
   *   return config;
   * });
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Добавляет перехватчик ответа
   * Перехватчики выполняются в порядке добавления после получения ответа
   *
   * @method addResponseInterceptor
   * @param {ResponseInterceptor} interceptor - Функция перехватчика
   * @returns {void}
   *
   * @example
   * // Извлечение data из ответа API (типичный случай)
   * api.addResponseInterceptor((response) => {
   *   if (response && typeof response === 'object' && 'data' in response) {
   *     return response.data;
   *   }
   *   return response;
   * });
   *
   * @example
   * // Обработка ошибок
   * api.addResponseInterceptor({
   *   (response) => {
   *     if (response.error) {
   *       throw new ApiError(response.error.message);
   *     }
   *     return response;
   *   }
   * });
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private async applyRequestInterceptors(
    config: RequestConfig,
  ): Promise<RequestConfig> {
    let result = config;

    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result);
    }

    return result;
  }

  private async applyResponseInterceptors<T>(response: T): Promise<T> {
    let result = response;

    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result);
    }

    return result;
  }

  // =====================
  // HELPERS
  // =====================

  private buildUrl(url: string, query?: Record<string, any>): string {
    const cleanBaseUrl = this.baseUrl.replace(/\/+$/, '');
    const isAbsoluteUrl = /^https?:\/\//i.test(url);
    const cleanUrl = isAbsoluteUrl
      ? url.replace(/\/+$/, '')
      : url.replace(/^\/+/, '').replace(/\/+$/, '');
    const fullUrl = isAbsoluteUrl ? cleanUrl : `${cleanBaseUrl}/${cleanUrl}`;

    if (!query) return fullUrl;

    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();

    return queryString ? `${fullUrl}?${queryString}` : fullUrl;
  }

  // =====================
  // CORE REQUEST
  // =====================

  private async request<T>(config: RequestConfig): Promise<T> {
    const finalConfig = await this.applyRequestInterceptors(config);

    const { url, method = 'GET', headers, body, query, signal } = finalConfig;

    const response = await fetch(this.buildUrl(url, query), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    if (!response.ok) {
      let errorText: string;

      try {
        errorText = await response.text();
      } catch {
        errorText = 'Unknown error';
      }

      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    let data: any;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return this.applyResponseInterceptors<T>(data);
  }

  // =====================
  // PUBLIC METHODS
  // =====================

  /**
   * Выполняет GET-запрос
   *
   * @method get
   * @param {string} url - Относительный URL (без baseUrl)
   * @param {Omit<RequestConfig, 'url' | 'method'>} [config] - Дополнительная конфигурация
   * @returns {Promise<T>} Данные ответа
   *
   * @example
   * // Простой GET-запрос
   * const users = await api.get<User[]>('/users');
   *
   * @example
   * // GET с query-параметрами
   * const users = await api.get<User[]>('/users', {
   *   query: { page: 1, limit: 10 }
   * });
   *
   * @example
   * // GET с заголовками
   * const data = await api.get('/protected', {
   *   headers: { 'Authorization': 'Bearer token' }
   * });
   *
   * @example
   * // GET с отменой
   * const controller = new AbortController();
   * const result = await api.get('/users', { signal: controller.signal });
   */
  get<T>(
    url: string,
    config?: Omit<RequestConfig, 'url' | 'method'>,
  ): Promise<T> {
    return this.request<T>({
      ...(config || {}),
      url,
      method: 'GET',
    });
  }

  /**
   * Выполняет POST-запрос
   *
   * @method post
   * @param {string} url - Относительный URL (без baseUrl)
   * @param {any} [body] - Тело запроса (будет сериализовано в JSON)
   * @param {Omit<RequestConfig, 'url' | 'method' | 'body'>} [config] - Дополнительная конфигурация
   * @returns {Promise<T>} Данные ответа
   *
   * @example
   * // Простой POST с телом
   * const newUser = await api.post<User>('/users', { name: 'John', email: 'john@example.com' });
   *
   * @example
   * // POST без тела
   * const result = await api.post('/subscribe', null, { query: { newsletter: true } });
   *
   * @example
   * // POST с дополнительными заголовками
   * const result = await api.post('/upload', formData, {
   *   headers: { 'Content-Type': 'multipart/form-data' }
   * });
   */
  post<T>(
    url: string,
    body?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'body'>,
  ): Promise<T> {
    return this.request<T>({
      ...(config || {}),
      url,
      method: 'POST',
      body,
    });
  }

  /**
   * Выполняет PUT-запрос (полное обновление ресурса)
   *
   * @method put
   * @param {string} url - Относительный URL (без baseUrl)
   * @param {any} [body] - Тело запроса
   * @param {Omit<RequestConfig, 'url' | 'method' | 'body'>} [config] - Дополнительная конфигурация
   * @returns {Promise<T>} Данные ответа
   *
   * @example
   * // Полное обновление пользователя
   * const updated = await api.put<User>('/users/1', { name: 'John', email: 'john@example.com' });
   */
  put<T>(
    url: string,
    body?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'body'>,
  ): Promise<T> {
    return this.request<T>({
      ...(config || {}),
      url,
      method: 'PUT',
      body,
    });
  }

  /**
   * Выполняет PATCH-запрос (частичное обновление ресурса)
   *
   * @method patch
   * @param {string} url - Относительный URL (без baseUrl)
   * @param {any} [body] - Тело запроса с частичными данными
   * @param {Omit<RequestConfig, 'url' | 'method' | 'body'>} [config] - Дополнительная конфигурация
   * @returns {Promise<T>} Данные ответа
   *
   * @example
   * // Частичное обновление (только имя)
   * const updated = await api.patch<User>('/users/1', { name: 'John' });
   */
  patch<T>(
    url: string,
    body?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'body'>,
  ): Promise<T> {
    return this.request<T>({
      ...(config || {}),
      url,
      method: 'PATCH',
      body,
    });
  }

  /**
   * Выполняет DELETE-запрос
   *
   * @method delete
   * @param {string} url - Относительный URL (без baseUrl)
   * @param {Omit<RequestConfig, 'url' | 'method'>} [config] - Дополнительная конфигурация
   * @returns {Promise<T>} Данные ответа
   *
   * @example
   * // Удаление ресурса
   * await api.delete('/users/1');
   *
   * @example
   * // DELETE с условием
   * await api.delete('/users/1', { query: { confirm: true } });
   */
  delete<T>(
    url: string,
    config?: Omit<RequestConfig, 'url' | 'method'>,
  ): Promise<T> {
    return this.request<T>({
      ...(config || {}),
      url,
      method: 'DELETE',
    });
  }
}
