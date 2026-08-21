export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ApiErrorEnvelope {
  error: ApiErrorBody;
}

export class ApiError extends Error {
  code: string;
  details?: Record<string, string[]>;
  status?: number;

  constructor(body: ApiErrorBody, status?: number) {
    super(body.message);
    this.name = "ApiError";
    this.code = body.code;
    this.details = body.details;
    this.status = status;
  }

  fieldError(field: string): string | undefined {
    return this.details?.[field]?.[0];
  }

  /**
   * A non-field-specific message suitable for a top-level form/page error
   * banner. Prefers DRF's conventional `non_field_errors` detail (e.g. "Unable
   * to log in with provided credentials.") over the generic top-level
   * `message` (e.g. "Invalid input.").
   */
  generalMessage(): string {
    return this.details?.non_field_errors?.[0] ?? this.message;
  }
}
