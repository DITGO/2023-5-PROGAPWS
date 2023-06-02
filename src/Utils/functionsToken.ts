import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

export async function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = request.headers['token_sso'];
  return response.status(200).json(request.headers['token_sso']);
}
