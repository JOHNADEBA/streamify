import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface ApiOptions extends RequestInit {
  authToken?: string; // ✅ Pass token explicitly
  headers?: HeadersInit;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

type CustomHeadersInit = HeadersInit & {
  Authorization?: string;
};

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

const request = async <T>(
  endpoint: string,
  options: ApiOptions = {},
  setLoading?: (loading: boolean) => void
): Promise<ApiResponse<T>> => {
  try {
    if (setLoading) setLoading(true);

    const headers: CustomHeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    // ✅ Attach token if provided
    if (options.authToken) {
      headers["Authorization"] = `Bearer ${options.authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data: T = await response.json();
    return { data };
  } catch (error) {
    return { error: isError(error) ? error.message : "Unknown error occurred" };
  } finally {
    if (setLoading) setLoading(false);
  }
};

const api = {
  get: <T>(
    endpoint: string,
    options: ApiOptions = {},
    setLoading?: (loading: boolean) => void
  ): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, { method: "GET", ...options }, setLoading);
  },

  post: <T>(
    endpoint: string,
    data: unknown,
    options: ApiOptions = {},
    setLoading?: (loading: boolean) => void
  ): Promise<ApiResponse<T>> => {
    return request<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
        ...options,
      },
      setLoading
    );
  },

  patch: <T>(
    endpoint: string,
    data: unknown,
    options: ApiOptions = {},
    setLoading?: (loading: boolean) => void
  ): Promise<ApiResponse<T>> => {
    return request<T>(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        ...options,
      },
      setLoading
    );
  },

  put: <T>(
    endpoint: string,
    data: unknown,
    options: ApiOptions = {},
    setLoading?: (loading: boolean) => void
  ): Promise<ApiResponse<T>> => {
    return request<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(data),
        ...options,
      },
      setLoading
    );
  },

  delete: <T>(
    endpoint: string,
    options: ApiOptions = {},
    setLoading?: (loading: boolean) => void
  ): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, { method: "DELETE", ...options }, setLoading);
  },
};

export default api;
