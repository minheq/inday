import { Request, Response, NextFunction } from "express";

export function handleCORS(_req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  next();
}

export function handleInternalError(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log(err.name, err.message);
  res.status(500).send("Something broke!");
}
