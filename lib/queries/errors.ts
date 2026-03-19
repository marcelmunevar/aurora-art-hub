import type { AuthError, PostgrestError } from "@supabase/supabase-js";

type QueryErrorOptions = {
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
};

export class QueryError extends Error {
  code?: string;
  details?: string;
  hint?: string;
  status?: number;

  constructor(message: string, options: QueryErrorOptions = {}) {
    super(message);
    this.name = "QueryError";
    this.code = options.code;
    this.details = options.details;
    this.hint = options.hint;
    this.status = options.status;
  }
}

export function createPostgrestQueryError(
  message: string,
  error: PostgrestError,
): QueryError {
  return new QueryError(message, {
    code: error.code,
    details: error.details,
    hint: error.hint,
    status: Number.isNaN(Number(error.code)) ? undefined : Number(error.code),
  });
}

export function createAuthQueryError(
  message: string,
  error: AuthError,
): QueryError {
  return new QueryError(message, {
    code: error.code,
    status: error.status,
  });
}

export function createNotFoundQueryError(message: string): QueryError {
  return new QueryError(message, {
    code: "NOT_FOUND",
    status: 404,
  });
}

export function createUnauthorizedQueryError(message: string): QueryError {
  return new QueryError(message, {
    code: "UNAUTHORIZED",
    status: 401,
  });
}

export function createConflictQueryError(message: string): QueryError {
  return new QueryError(message, {
    code: "CONFLICT",
    status: 409,
  });
}
