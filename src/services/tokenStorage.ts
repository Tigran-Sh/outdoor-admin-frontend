const ACCESS_TOKEN_KEY = "AUTH_ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "AUTH_REFRESH_TOKEN";

function detectStorage(): Storage {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY) ? window.localStorage : window.sessionStorage;
}

// Tracks which Storage the tokens currently live in (localStorage when
// "remember me" was checked at login, sessionStorage otherwise), so rotated
// tokens get written back to the same place without every call site having
// to pass rememberMe explicitly.
let tokenStorage: Storage = detectStorage();

// Both tokens are read straight from Storage on every call rather than
// cached in a module-level variable. Two reasons:
//  1. A plain page reload can reuse a still-valid access token directly
//     instead of always spending a refresh-token rotation just to get back
//     a token it already had a few seconds earlier (both wasteful and one
//     more chance to hit the single-use-rotation race between concurrent
//     refresh calls -- see httpClient.ts).
//  2. When "remember me" is on, tokens live in localStorage, which is
//     shared across tabs -- but a module-level JS variable is NOT (each tab
//     has its own copy of this module's memory). Caching the access token
//     in memory meant that after tab A refreshed and another tab (B) was
//     told by the cross-tab refresh lock to just reuse what A obtained,
//     B's getAccessToken() returned ITS OWN stale in-memory copy instead of
//     A's newly-written token. Reading straight from Storage sidesteps that
//     entirely -- a plain synchronous read, cheap enough to do per-request.
export function getAccessToken(): string | null {
  return tokenStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  if (token) {
    tokenStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

export function getRefreshToken(): string | null {
  return tokenStorage.getItem(REFRESH_TOKEN_KEY);
}

function setRefreshToken(token: string | null): void {
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  if (token) {
    tokenStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

/**
 * @param rememberMe `true` -> localStorage (survives browser restarts),
 *   `false` -> sessionStorage (cleared when the tab/browser closes). Omit to
 *   keep using whichever storage is already active (e.g. on token rotation,
 *   where both the new access and refresh token get written back to
 *   wherever the session already lived).
 */
export function setTokens(access: string, refresh: string, rememberMe?: boolean): void {
  if (rememberMe !== undefined) {
    tokenStorage = rememberMe ? window.localStorage : window.sessionStorage;
  }
  setAccessToken(access);
  setRefreshToken(refresh);
}

export function clearTokens(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
