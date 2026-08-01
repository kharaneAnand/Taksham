import User from "../models/user.model.js";
import ApiError from "../helpers/ApiError.js";
import { StatusCodes } from "../constants/http.js";
import { hashPassword } from "../utils/bcrypt.js";
import { RegisterInput } from "../validators/auth.validator.js";

class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await User.findOne({
      email: data.email,
    });

    if (existingUser) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Email already exists"
      );
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    const userObject = user.toObject();

    const { password, refreshToken, ...userData } = userObject;

    return userData;
  }
}

export default new AuthService();