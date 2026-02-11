export type JwtPayload = {
  sub?: string;
  email?: string;
  role?: string;
  companyId?: string | null;
  iat?: number;
  exp?: number;
};

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const normalized = base64 + pad;
  if (typeof window !== "undefined") {
    return atob(normalized);
  }
  return Buffer.from(normalized, "base64").toString("utf-8");
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}
