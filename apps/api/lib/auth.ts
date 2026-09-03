import jwt from "jsonwebtoken";

export interface AuthResult {
  ok: boolean;
  status: number;
  message: string;
  userId?: string;
  docId?: string;
  hospitalId?: string;
}

function fail(message: string, status = 401): AuthResult {
  return { ok: false, status, message };
}

export function verifyAdmin(token?: string | null): AuthResult {
  if (!token) {
    return fail("Not Authorised Try Login again");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    if (decoded !== `${process.env.ADMIN_EMAIL || ""}${process.env.ADMIN_PW || ""}`) {
      return fail("Not Authorised Login again");
    }
    return { ok: true, status: 200, message: "ok" };
  } catch (error) {
    return fail((error as Error).message);
  }
}

export function verifyDoctor(token?: string | null): AuthResult {
  if (!token) {
    return fail("Not Authorised Login again");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id?: string;
    };
    return { ok: true, status: 200, message: "ok", docId: decoded.id };
  } catch (error) {
    return fail((error as Error).message);
  }
}

export function verifyHospital(token?: string | null): AuthResult {
  if (!token) {
    return fail("Not Authorised Login again");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id?: string;
    };
    return {
      ok: true,
      status: 200,
      message: "ok",
      hospitalId: decoded.id,
    };
  } catch (error) {
    return fail((error as Error).message);
  }
}

export function verifyUser(token?: string | null): AuthResult {
  if (!token) {
    return fail("Not Authorised Login again");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id?: string;
    };
    return { ok: true, status: 200, message: "ok", userId: decoded.id };
  } catch (error) {
    return fail((error as Error).message);
  }
}

export function getAuthToken(headers: Headers, key: string): string | null {
  return headers.get(key);
}
