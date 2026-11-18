export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  verified: boolean;
  contactNumber?: string | null;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

const API_URL =
  import.meta.env?.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

const AUTH_STORAGE_KEY = "casafind-auth-session";

export function readStoredAuth(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function persistAuth(session: AuthSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

async function graphqlRequest<T>(query: string): Promise<T> {
  const response = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message ?? "Authentication request failed");
  }

  return payload.data as T;
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  const data = await graphqlRequest<{ login: { token: string; user: AuthUser } }>(`
    mutation {
      login(email: ${JSON.stringify(email)}, password: ${JSON.stringify(password)}) {
        token
        user {
          id
          firstName
          lastName
          email
          role
          verified
          contactNumber
        }
      }
    }
  `);

  if (!data.login) {
    throw new Error("Unable to sign in.");
  }

  return {
    token: data.login.token,
    user: data.login.user,
  };
}

export type SignUpRole = "SEEKER" | "LISTER";

export async function signUp(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: SignUpRole = "SEEKER",
): Promise<AuthSession> {
  const data = await graphqlRequest<{ register: { token: string; user: AuthUser } }>(`
    mutation {
      register(
        firstName: ${JSON.stringify(firstName)},
        lastName: ${JSON.stringify(lastName)},
        email: ${JSON.stringify(email)},
        password: ${JSON.stringify(password)},
        role: ${JSON.stringify(role)}
      ) {
        token
        user {
          id
          firstName
          lastName
          email
          role
          verified
          contactNumber
        }
      }
    }
  `);

  if (!data.register) {
    throw new Error("Unable to create account.");
  }

  return {
    token: data.register.token,
    user: data.register.user,
  };
}
