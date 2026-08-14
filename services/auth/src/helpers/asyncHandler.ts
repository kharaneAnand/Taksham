import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

type AsyncHandler<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
> = (
  req: Request<
    P,
    ResBody,
    ReqBody,
    ReqQuery
  >,
  res: Response<ResBody>,
  next: NextFunction,
) => Promise<void>;

const asyncHandler = <
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
>(
  handler: AsyncHandler<
    P,
    ResBody,
    ReqBody,
    ReqQuery
  >,
): RequestHandler<
  P,
  ResBody,
  ReqBody,
  ReqQuery
> => {
  return (
    req,
    res,
    next,
  ) => {
    Promise.resolve(
      handler(
        req,
        res,
        next,
      ),
    ).catch(next);
  };
};

export default asyncHandler;