import { Request, Response } from "express";
import { ControllerResponse, ErrorHandler } from "../middlewares/errorHandler";
import BigPromise from "../middlewares/bigPromise";
import RefreshTokenModel from "../models/refreshToken";
import jwtService from "../utils/jwtService";

interface RefreshTokenData {
  token?: string | undefined;
  createdAt: Date;
}
export const refresh = BigPromise(async (req: Request, res: Response) => {
  try {
    if (!req.body.refresh_token) {
      return ErrorHandler(res, 400, "Token is required");
    }

    // check if token is in db.
    const refreshToken: RefreshTokenData | null =
      await RefreshTokenModel.findOne({
        token: req.body.refresh_token,
      });

    if (!refreshToken) {
      return ErrorHandler(res, 400, "Invalid refresh token");
    }

    // get _id & email
    const { _id, email } = jwtService.verify(
      refreshToken.token!,
      process.env.REFRESH_TOKEN_KEY
    );

    // generate access token
    const access_token = jwtService.sign({
      _id,
      email,
    });
    const refresh_token = jwtService.sign(
      {
        _id,
        email,
      },
      "30d",
      process.env.REFRESH_TOKEN_KEY
    );

    // store refresh token in the database
    await RefreshTokenModel.create({ token: refresh_token });

    // remove the old refresh token from the database
    await RefreshTokenModel.findOneAndDelete({ token: req.body.refresh_token });

    return ControllerResponse(res, 200, { access_token, refresh_token });
  } catch (error) {
    return ErrorHandler(res, 500, error.message || "Internal Server Error");
  }
});
