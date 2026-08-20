import { NextRequest, NextResponse } from "next/server";
import { isValidCredentials, getAuthConfig } from "@/lib/auth-core";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const config = getAuthConfig();

  if (!config.secret || !isValidCredentials(username, password, config.username, config.password)) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  setAuthCookie(response);
  return response;
}
