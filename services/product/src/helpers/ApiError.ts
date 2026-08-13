class ApiError extends Error {
  statusCode: number;
  errors: unknown[];

  constructor(
    statusCode: number,
    message: string,
    errors: unknown[] = [],
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(
      this,
      this.constructor,
    );
  }
}

export default ApiError;