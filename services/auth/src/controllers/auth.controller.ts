import { Request, Response } from "express";

class AuthController {
  async register(req: Request, res: Response) {
    res.status(201).json({
      success: true,
      message: "Register endpoint working",
    });
  }
}

export default new AuthController();