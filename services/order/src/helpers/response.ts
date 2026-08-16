import type { Response } from "express";

export const successResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors: unknown = null,
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};