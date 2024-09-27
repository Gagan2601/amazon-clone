import { Response } from "express";

const ControllerResponse = (
  res: Response,
  status: number,
  data?: Object,
  message?: String
) => {
  return res.status(status).send({ message, success: true, data });
};

const ErrorHandler = (
  res: Response,
  status: number,
  message: string,
  errors?: string
) => {
  console.log(message, errors);
  return res.status(status).send({ message, success: false, errors });
};

export { ControllerResponse, ErrorHandler };
