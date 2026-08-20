import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createAuthToken, getAuthConfig, hasValidAuthToken } from "./auth-core";

export async function isAuthenticated() {
  const { secret } = getAuthConfig();
  const cookie = (await cookies()).get(AUTH_COOKIE_NAME);
  return hasValidAuthToken(cookie?.value, secret);
}

export async function requireApiAuth() {
  if (await isAuthenticated()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function setAuthCookie(response: NextResponse) {
  const { secret } = getAuthConfig();
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: createAuthToken(secret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
