class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors: unknown[] = [],
  ) {
    super(message);

    this.name = "ApiError";

    Error.captureStackTrace(
      this,
      this.constructor,
    );
  }
}

export default ApiError;