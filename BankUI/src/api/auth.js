import { decodeJwtPayload, isTokenExpired } from "../utils/jwt";

const API_BASE_URL = "https://uxdrf2vote.execute-api.us-east-1.amazonaws.com/api/v5";

export class TokenExpiredError extends Error {
   constructor() {
      super("Your session has expired. Please log in again.");
      this.name = "TokenExpiredError";
   }
}

function assertTokenNotExpired(token) {
   if (isTokenExpired(token)) {
      throw new TokenExpiredError();
   }
}

async function parseResponse(response) {
   const responseText = await response.text();
   if (!responseText) return null;

   try {
      return JSON.parse(responseText);
   } catch {
      return responseText;
   }
}

async function requestAuth(path, payload) {
   const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
   });

   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export async function getUserAccounts(token) {
   assertTokenNotExpired(token);
   const response = await fetch(`${API_BASE_URL}/users/me/accounts`, {
      cache: "no-store",
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   if (!data || typeof data !== "object" || !Array.isArray(data.accounts)) {
      throw new Error("The accounts response was not in the expected format.");
   }

   return data;
}

export async function createAccount(token, accountType, fields = {}) {
   assertTokenNotExpired(token);
   const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...fields, accountType: accountType }),
   });
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export async function getAccountTransactions(token, accountId) {
   assertTokenNotExpired(token);
   const response = await fetch(
      `${API_BASE_URL}/accounts/${encodeURIComponent(accountId)}/transactions`,
      {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      },
   );
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   if (!data || typeof data !== "object" || !Array.isArray(data.transactions)) {
      throw new Error("The transactions response was not in the expected format.");
   }

   return data;
}

export async function createTransaction(token, accountId, transaction) {
   assertTokenNotExpired(token);
   const response = await fetch(
      `${API_BASE_URL}/accounts/${encodeURIComponent(accountId)}/transactions`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify(transaction),
      },
   );
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export async function closeAccount(token, accountId) {
   assertTokenNotExpired(token);
   const response = await fetch(
      `${API_BASE_URL}/accounts/${encodeURIComponent(accountId)}/close`,
      {
         method: "POST",
         headers: {
            Authorization: `Bearer ${token}`,
         },
      },
   );
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export async function deactivateUser(token) {
   assertTokenNotExpired(token);
   const response = await fetch(`${API_BASE_URL}/users/me/deactivate`, {
      method: "POST",
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export async function updateUserProfile(token, { name, email, password }) {
   assertTokenNotExpired(token);
   const payload = decodeJwtPayload(token);
   const auth = payload?.auth;
   const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password, auth, status: "active" }),
   });
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export function registerUser({ name, email, password }) {
   return requestAuth("/auth/register", { name, email, password });
}

export function loginUser({ email, password }) {
   return requestAuth("/auth/login", { email, password });
}

async function requestAdmin(token, path) {
   assertTokenNotExpired(token);
   const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export async function getAllUsers(token) {
   const data = await requestAdmin(token, "/admin/users");
   if (Array.isArray(data)) return data;
   if (data && Array.isArray(data.users)) return data.users;
   return [];
}

export async function getAllAccounts(token) {
   const data = await requestAdmin(token, "/accounts/");
   if (Array.isArray(data)) return data;
   if (data && Array.isArray(data.accounts)) return data.accounts;
   return [];
}

export async function getAllTransactions(token) {
   const data = await requestAdmin(token, "/transactions/");
   if (Array.isArray(data)) return data;
   if (data && Array.isArray(data.transactions)) return data.transactions;
   return [];
}

export async function updateUserByAdmin(token, userId, { name, email, status, auth }) {
   assertTokenNotExpired(token);
   const response = await fetch(
      `${API_BASE_URL}/admin/users/${encodeURIComponent(userId)}`,
      {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({ name, password: "", email, status, auth }),
      },
   );
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export async function deactivateUserByAdmin(token, userId) {
   assertTokenNotExpired(token);
   const response = await fetch(
      `${API_BASE_URL}/admin/users/${encodeURIComponent(userId)}deactivate`,
      {
         method: "POST",
         headers: {
            Authorization: `Bearer ${token}`,
         },
      },
   );
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export async function createUserByAdmin(token, { name, password, email, status, auth }) {
   assertTokenNotExpired(token);
   const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, password, email, status, auth }),
   });
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}

export async function updateAccountByAdmin(
   token,
   accountId,
   { balance, accountType, status },
) {
   assertTokenNotExpired(token);
   const response = await fetch(
      `${API_BASE_URL}/accounts/${encodeURIComponent(accountId)}`,
      {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({ balance, accountType, status }),
      },
   );
   const data = await parseResponse(response);

   if (!response.ok) {
      const message =
         typeof data === "object" && data?.detail
            ? data.detail
            : typeof data === "object" && data?.message
              ? data.message
              : typeof data === "string" && data
                ? data
                : `Request failed with status ${response.status}.`;
      throw new Error(message);
   }

   return data;
}
