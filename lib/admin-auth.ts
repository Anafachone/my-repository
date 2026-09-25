import { createHmac, timingSafeEqual } from "crypto";

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "fallback-dev-secret";
}

export function generateAdminToken(password: string): string {
  return createHmac("sha256", getSecret()).update(password).digest("hex");
}

export function verifyAdminToken(token: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const expected = generateAdminToken(password);
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
