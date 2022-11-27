import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { userRepository } from '../services/UserService';

dotenv.config({ path: '.env.local' });

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers.authorization;
  console.log(`\x1b[32mBearer token : \x1b[0m${bearerToken}`);
  const accessToken = bearerToken?.split(' ')[1];
  console.log(`\x1b[32mAccess token : \x1b[0m${accessToken}`);

  if (!accessToken) {
    res.status(401).send({ message: 'Missing token' });
    return;
  } else {
    try {
      if (process.env.ACCESS_SECRET_TOKEN) {
        const payload: any = jwt.verify(
          accessToken,
          process.env.ACCESS_SECRET_TOKEN
        );

        if (!payload) {
          res.status(403).send({ message: 'Unauthorized token' });
          return;
        }

        const user = await userRepository.findOne({
          where: {
            id: payload.sub,
          },
        });

        // ici on reinjecte dans le body le payload.sub (body ou headers)

        if (!user) {
          res.status(404).send({ message: "User doesn't exist" });
          return;
        }

        next();
      }
    } catch (error: any) {
      console.log(`\x1b[31mMiddleware Error : \x1b[0m${error.message}`);
      res.status(error?.status || 500).send({
        message: 'You need to login again',
        data: error?.message | error,
      });
    }
  }
};
