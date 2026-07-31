const API_BASE_URL = "https://4e28fjb9t8.execute-api.us-east-1.amazonaws.com/api/v4";

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
   const response = await fetch(`${API_BASE_URL}/users/me/accounts`, {
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

export function registerUser({ name, email, password }) {
   return requestAuth("/auth/register", { name, email, password });
}

export function loginUser({ email, password }) {
   return requestAuth("/auth/login", { email, password });
}
