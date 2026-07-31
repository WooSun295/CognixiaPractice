function base64UrlDecode(segment) {
   const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
   const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
   );
   return atob(padded);
}

export function decodeJwtPayload(token) {
   if (!token || typeof token !== "string") return null;

   const parts = token.split(".");
   if (parts.length < 2) return null;

   try {
      return JSON.parse(base64UrlDecode(parts[1]));
   } catch {
      return null;
   }
}

// Compares the JWT's "exp" claim (seconds since epoch) against the current time.
export function isTokenExpired(token) {
   const payload = decodeJwtPayload(token);
   if (!payload || typeof payload.exp !== "number") return false;

   return Date.now() >= payload.exp * 1000;
}
