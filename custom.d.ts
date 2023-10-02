import { Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express'

declare module 'express' {
  interface Request {
    user?: number;
    admin?: boolean;
  }

  interface Response extends ExpressResponse {}

  type NextFunction = ExpressNextFunction;
}

declare module 'express' {
  interface Request {
    user?: number;
    admin?: boolean;
  }
}