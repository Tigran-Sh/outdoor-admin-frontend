import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { ApiError, type ApiErrorEnvelope } from "@/types/apiError";
import type { RefreshResponse } from "@/types/auth";

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./tokenStorage";

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const httpClient = axios.create({ baseURL });

// A plain instance with no interceptors, used only to call the refresh
// endpoint itself so a failed refresh can't recursively trigger the
// response interceptor below.
const refreshClient = axios.create({ baseURL });

let onAuthFailure: (() => void) | null = null;

export function setOnAuthFailure(handler: (() => void) | null): void {
  onAuthFailure = handler;
}

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

function toApiError(error: AxiosError): ApiError {
  const data = error.response?.data as ApiErrorEnvelope | undefined;
  if (data?.error) {
    return new ApiError(data.error, error.response?.status);
  }
  return new ApiError(
    { code: "network_error", message: error.message },
    error.response?.status,
  );
}

async function doRefresh(refresh: string): Promise<string | null> {
  try {
    const { data } = await refreshClient.post<RefreshResponse>("/api/v1/auth/refresh/", {
      refresh,
    });
    setTokens(data.access, data.refresh);
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
}

let refreshPromise: Promise<string | null> | null = null;

// Exported so callers outside this module (namely AuthProvider's bootstrap
// silent-refresh) share the exact same in-flight promise instead of firing
// their own concurrent refresh call -- refresh tokens rotate and are
// single-use, so two simultaneous calls with the same token would race and
// one would always fail, incorrectly logging the user out.
export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  if (!refreshPromise) {
    refreshPromise = runCoordinatedRefresh(refresh).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

// The `refreshPromise` dedup above only covers concurrent calls within THIS
// tab. Multiple tabs of the app share the same (rotating, single-use)
// refresh token via storage, so two tabs refreshing at the same moment can
// still race each other -- whichever request reaches the backend second
// gets rejected (already rotated/blacklisted) and force-logs that tab out,
// even though the session is perfectly fine. The Web Locks API coordinates
// this across tabs/origins: only one tab actually calls the refresh
// endpoint at a time, others wait, then just reuse the token that tab
// already obtained instead of firing a conflicting request of their own.
async function runCoordinatedRefresh(refresh: string): Promise<string | null> {
  if (typeof navigator === "undefined" || !navigator.locks) {
    return doRefresh(refresh);
  }

  return navigator.locks.request("outdoor-admin-auth-refresh", async () => {
    // Another tab may have already rotated past this exact token while we
    // were waiting for the lock -- if so, just use what it obtained instead
    // of sending this (now stale) refresh token ourselves.
    const latestRefresh = getRefreshToken();
    if (latestRefresh !== refresh) {
      return getAccessToken();
    }
    return doRefresh(latestRefresh);
  });
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const apiError = toApiError(error);

    // A 401 means either no token was sent at all (code "not_authenticated")
    // or one was sent but is expired/invalid (code "token_not_valid", per
    // SimpleJWT). Both are worth attempting a silent refresh for -- only
    // "permission_denied" (valid token, insufficient rights) shouldn't
    // trigger one.
    const isExpiredAccessToken =
      error.response?.status === 401 &&
      (apiError.code === "not_authenticated" || apiError.code === "token_not_valid");

    if (isExpiredAccessToken && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return httpClient(originalRequest);
      }

      onAuthFailure?.();
    }

    return Promise.reject(apiError);
  },
);

export default httpClient;
