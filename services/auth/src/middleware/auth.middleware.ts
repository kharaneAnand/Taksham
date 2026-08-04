import { NextFunction, Request, Response } from "express";
import ApiError from "../helpers/ApiError.js";
import User from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { StatusCodes } from "../constants/http.js";
import { COOKIE_NAMES } from "../constants/cookies.js";

const authenticate = async (req: Request,res: Response, next: NextFunction) => {

    const accessToken = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];

    if (!accessToken) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            AUTH_MESSAGES.INVALID_TOKEN
        );
    }

    const payload = verifyAccessToken(accessToken);
    const user = await User.findById(payload.userId);

    if (!user) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            AUTH_MESSAGES.INVALID_TOKEN
        );
    }

     req.user = {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
    };

    next();

};

export default authenticate;