class ApiResponse<T> {
  public success: boolean;

  constructor(
    public statusCode: number,
    public data: T | null,
    public message: string
  ) {
    this.success = statusCode < 400;
  }
}

export default ApiResponse;