interface AxiosLikeError {
  isAxiosError: true;
  response?: {
    status: number;
    data?: {
      message?: string | string[];
      error?: string;
    };
  };
  message?: string;
}

const isAxiosError = (error: unknown): error is AxiosLikeError =>
  typeof error === "object" &&
  error !== null &&
  "isAxiosError" in error &&
  (error as AxiosLikeError).isAxiosError === true;

const statusMessages: Record<number, string> = {
  400: "Bad request",
  401: "Session expired",
  403: "Access denied",
  404: "Not found",
  409: "Conflict — this resource already exists",
  422: "Validation failed",
  429: "Too many requests, please try again later",
};

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    // No response at all → network error
    if (!error.response) {
      return "No internet connection";
    }

    const { status, data } = error.response;

    // Try server-provided message first
    if (data?.message) {
      const msg = Array.isArray(data.message) ? data.message[0] : data.message;
      if (typeof msg === "string" && msg.length > 0) {
        return msg;
      }
    }

    if (typeof data?.error === "string" && data.error.length > 0) {
      return data.error;
    }

    // Fall back to status code mapping
    if (status >= 500) {
      return "Something went wrong, please try again";
    }

    return statusMessages[status] ?? "Something went wrong";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
