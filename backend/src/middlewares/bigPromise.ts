import { NextFunction, Request, Response } from "express";

export default (func) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(func(req, res, next)).catch(next);
