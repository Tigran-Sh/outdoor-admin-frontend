import { useCallback, useEffect, useState, type ReactNode } from "react";

import * as authApi from "@/services/auth.api";
import { setOnAuthFailure } from "@/services/httpClient";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/services/tokenStorage";
import type { User } from "@/types/auth";

import { AuthContext, type AuthStatus } from "./useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    getAccessToken() || getRefreshToken() ? "loading" : "unauthenticated",
  );

  useEffect(() => {
    if (!getAccessToken() && !getRefreshToken()) return;

    // Just call getMe() directly -- the (persisted, rehydrated at module
    // load) access token is attached automatically by httpClient's request
    // interceptor. If it's missing or has expired, httpClient's response
    // interceptor already transparently does a single, deduplicated
    // refresh-and-retry for ANY request (see httpClient.ts), so there's no
    // need to duplicate that logic here with a separate explicit refresh
    // call -- doing so previously meant every single page load spent a
    // refresh-token rotation even when the cached access token was still
    // perfectly valid, which was both wasteful and extra exposure to the
    // single-use-rotation race between concurrent refresh calls.
    authApi
      .getMe()
      .then((me) => {
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => {
        clearTokens();
        setUser(null);
        setStatus("unauthenticated");
      });
  }, []);

  useEffect(() => {
    setOnAuthFailure(() => {
      clearTokens();
      setUser(null);
      setStatus("unauthenticated");
    });
    return () => setOnAuthFailure(null);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    const { access, refresh: refreshToken, user: loggedInUser } = await authApi.login({
      email,
      password,
    });
    setTokens(access, refreshToken, rememberMe);
    setUser(loggedInUser);
    setStatus("authenticated");
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Best-effort: still clear the local session even if the request fails.
      }
    }
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>{children}</AuthContext.Provider>
  );
}
