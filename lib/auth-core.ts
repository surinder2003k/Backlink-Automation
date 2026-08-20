import crypto from "node:crypto";

export const AUTH_COOKIE_NAME = "xylos_auth";

export function getAuthConfig() {
  return {
    username: process.env.XYLOS_AUTH_USERNAME ?? "",
    password: process.env.XYLOS_AUTH_PASSWORD ?? "",
    secret: process.env.XYLOS_AUTH_SECRET ?? "",
  };
}

export function isValidCredentials(username: string, password: string, expectedUsername: string, expectedPassword: string) {
  return Boolean(expectedUsername && expectedPassword && username === expectedUsername && password === expectedPassword);
}

export function createAuthToken(secret: string) {
  return crypto.createHmac("sha256", secret).update(AUTH_COOKIE_NAME).digest("hex");
}

export function hasValidAuthToken(token: string | undefined, secret: string) {
  if (!token || !secret) return false;
  const expected = createAuthToken(secret);
  const received = Buffer.from(token, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return received.length === expectedBuffer.length && crypto.timingSafeEqual(received, expectedBuffer);
}
