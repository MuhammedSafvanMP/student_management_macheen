import { Request, Response, NextFunction, RequestHandler } from 'express';
import logger from '../utils/logger';

 type params = (req: Request, res: Response, next: NextFunction) => Promise<Response>;

export const trycatch = (controller: params): RequestHandler => {
  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
    logger.error("Error",error);
      
      return next(error);
    }
  };
};

