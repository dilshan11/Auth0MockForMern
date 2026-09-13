const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  token?: string;
  body?: unknown;
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, body, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const message = await res
      .json()
      .then((data) => data?.message as string | undefined)
      .catch(() => undefined);
    throw new ApiError(res.status, message ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
