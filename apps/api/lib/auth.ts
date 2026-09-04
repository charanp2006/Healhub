import { encode, decode } from "@auth/core/jwt";
import type { JWT } from "@auth/core/jwt";

const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60;

export type AuthRole = "user" | "doctor" | "hospital" | "admin";

export interface AuthResult {
  ok: boolean;
  status: number;
  message: string;
  userId?: string;
  docId?: string;
  hospitalId?: string;
}

export interface AuthTokenPayload {
  id: string;
  role: AuthRole;
  email?: string;
  name?: string;
}

function fail(message: string, status = 401): AuthResult {
  return { ok: false, status, message };
}

function secret(): string {
  return process.env.AUTH_SECRET || process.env.JWT_SECRET || "";
}

// Stable salt shared between encode/decode so the Derived Encryption Key
// always matches. Auth.js derives its salt from the cookie name + secret;
// using an explicit constant keeps server-side minting/verification aligned.
function salt(): string {
  return "healhub-authjs-session";
}

export async function signAuthToken(
  payload: AuthTokenPayload
): Promise<string | null> {
  const token = {
    sub: payload.id,
    role: payload.role,
    email: payload.email,
    name: payload.name,
  } as JWT;
  if (!secret()) return null;
  try {
    return await encode({
      token,
      secret: secret(),
      salt: salt(),
      maxAge: DEFAULT_MAX_AGE,
    });
  } catch (error) {
    console.log("Error signing auth token:", error);
    return null;
  }
}

async function decodeToken(token?: string | null): Promise<JWT | null> {
  if (!token) return null;
  try {
    return await decode({ token, secret: secret(), salt: salt() });
  } catch (error) {
    console.log("Error verifying auth token:", error);
    return null;
  }
}

export async function verifyAdmin(token?: string | null): Promise<AuthResult> {
  const decoded = await decodeToken(token);
  if (!decoded || decoded.role !== "admin") {
    return fail("Not Authorised Login again");
  }
  return { ok: true, status: 200, message: "ok" };
}

export async function verifyDoctor(token?: string | null): Promise<AuthResult> {
  const decoded = await decodeToken(token);
  if (!decoded || decoded.role !== "doctor" || !decoded.sub) {
    return fail("Not Authorised Login again");
  }
  return { ok: true, status: 200, message: "ok", docId: String(decoded.sub) };
}

export async function verifyHospital(
  token?: string | null
): Promise<AuthResult> {
  const decoded = await decodeToken(token);
  if (!decoded || decoded.role !== "hospital" || !decoded.sub) {
    return fail("Not Authorised Login again");
  }
  return {
    ok: true,
    status: 200,
    message: "ok",
    hospitalId: String(decoded.sub),
  };
}

export async function verifyUser(token?: string | null): Promise<AuthResult> {
  const decoded = await decodeToken(token);
  if (!decoded || decoded.role !== "user" || !decoded.sub) {
    return fail("Not Authorised Login again");
  }
  return { ok: true, status: 200, message: "ok", userId: String(decoded.sub) };
}

// Kept for signature compatibility where callers used the promise sync-style.
export function getAuthToken(headers: Headers, key: string): string | null {
  return headers.get(key);
}
