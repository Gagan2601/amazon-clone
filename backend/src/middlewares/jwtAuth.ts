import { ErrorHandler, ControllerResponse } from "./errorHandler";
import bigPromise from "./bigPromise";
import JwtService from "../utils/jwtService";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  _id: string;
  email: string;
}

const authenticateToken = bigPromise(
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string = req.headers.authorization || "";

    if (!authHeader) {
      return ErrorHandler(res, 400, "unAuthorized");
    }

    const token: string = authHeader.split(" ")[1];
    try {
      const { _id, email }: JwtPayload = JwtService.verify(token);
      req.user = {
        _id,
        email,
      };
      next();
    } catch (err) {
      return ErrorHandler(res, 403, "Invalid token");
    }
  }
);

export { authenticateToken };
