import { Request, Response } from "express";
import User from "../models/user";
import Seller from "../models/seller";
import Admin from "../models/admin";
import jwt from "../utils/jwtService";
import { ControllerResponse, ErrorHandler } from "../middlewares/errorHandler";
import RefreshToken from "../models/refreshToken";
import { hashPassword, verifyPassword } from "../middlewares/encryption";

function checkEmail(email: string): boolean {
  const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

const register = async (req: Request, res: Response, Model: any) => {
  const { email, password, name } = req.body;
  console.log(req.body);

  if (checkEmail(email) === false) {
    return ErrorHandler(res, 400, "Invalid Email");
  }

  if (password == null || password === undefined || password.length < 6) {
    return ErrorHandler(res, 400, "Invalid Password");
  }

  const userExist = await Model.findOne({ email });

  if (userExist) {
    return ErrorHandler(res, 400, "Email already exists");
  }

  try {
    const user = await Model.create({
      email,
      password: await hashPassword(password),
      name,
    });

    user.save();

    const access_token = jwt.sign({
      _id: user._id,
      email,
    });

    const refresh_token = jwt.sign(
      {
        _id: user._id,
        email,
      },
      process.env.REFRESH_TOKEN_KEY!,
      "30d"
    );

    await RefreshToken.create({ token: refresh_token });

    delete user._doc.password;

    return ControllerResponse(res, 200, {
      message: "Signup Successful!",
      ...user._doc,
      refresh_token,
      access_token,
    });
  } catch (err) {
    console.log(err);
    ErrorHandler(res, 500, "Internal Server Error");
  }
};

const login = async (req: Request, res: Response, Model: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ErrorHandler(res, 400, "Username/Email and password are required");
  }

  try {
    const user = await Model.findOne({
      email: email,
    });

    if (!user) {
      return ErrorHandler(res, 403, "Invalid credentials");
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return ErrorHandler(res, 403, "Invalid credentials");
    }

    const access_token = jwt.sign({
      _id: user._id,
      email: user.email,
    });

    const refresh_token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.REFRESH_TOKEN_KEY!,
      "30d"
    );

    await RefreshToken.create({ token: refresh_token });

    delete user._doc.password;

    return ControllerResponse(res, 200, {
      message: "Login Successful!",
      ...user._doc,
      refresh_token,
      access_token,
    });
  } catch (err) {
    console.log(err);
    ErrorHandler(res, 500, "Internal Server Error");
  }
};

const getData = async (req: Request, res: Response, Model: any) => {
  try {
    const entity = await Model.findById(req.user._id);
    delete entity._doc.password;

    return ControllerResponse(res, 200, {
      ...entity._doc,
    });
  } catch (err) {
    console.log(err);
    ErrorHandler(res, 500, "Internal Server Error");
  }
};

export const userRegister = (req: Request, res: Response): void => {
  register(req, res, User).catch((err) => console.error(err));
};

export const userLogin = (req: Request, res: Response): void => {
  login(req, res, User).catch((err) => console.error(err));
};

export const userData = (req: Request, res: Response): void => {
  getData(req, res, User).catch((err) => console.error(err));
};

export const sellerRegister = (req: Request, res: Response): void => {
  register(req, res, Seller).catch((err) => console.error(err));
};

export const sellerLogin = (req: Request, res: Response): void => {
  login(req, res, Seller).catch((err) => console.error(err));
};

export const sellerData = (req: Request, res: Response): void => {
  getData(req, res, Seller).catch((err) => console.error(err));
};

export const adminRegister = (req: Request, res: Response): void => {
  register(req, res, Admin).catch((err) => console.error(err));
};

export const adminLogin = (req: Request, res: Response): void => {
  login(req, res, Admin).catch((err) => console.error(err));
};
