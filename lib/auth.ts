// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
export const COOKIE_NAME = "admin_session";

export interface AdminPayload {
  // ✅ renommé pour éviter le conflit
  userId: number;
  identifiant: string;
}

export async function signToken(payload: AdminPayload) {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AdminPayload;
  } catch (err) {
    console.error("[verifyToken]", err);
    return null;
  }
}
