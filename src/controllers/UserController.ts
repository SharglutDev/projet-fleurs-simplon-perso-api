import { Request, Response } from 'express';
import { User } from '../entities/user.entity';
import { UserService } from '../services/UserService';
import bcrypt from 'bcryptjs';
import jwt, { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export class UserController {
  public userService = new UserService();

  async signUpNewUser(req: Request, res: Response): Promise<void> {
    const newUser: User = { ...req.body };
    const { email, password } = newUser;

    if (!email || !password) {
      res.status(400).send({ message: 'Missing Parameter' });
      return;
    }
    try {
      const user = await this.userService.signUpNewUser(newUser);
      res.status(200).send({
        message: 'Account successfully created, you can now login',
        data: user,
      });
    } catch (error: any) {
      res.status(error?.status || 500).send({
        message: 'Une erreur est survenue',
        data: error?.message || error,
      });
    }
  }

  async logInUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const user = await this.userService.logInUser(email);

      if (!user) {
        res.status(400).send({ message: 'email/password invalid' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(400).send({ message: 'password/email invalid' });
        return;
      }

      if (process.env.ACCESS_SECRET_TOKEN && process.env.REFRESH_SECRET_TOKEN) {
        const accessToken = sign(
          { sub: user.id },
          process.env.ACCESS_SECRET_TOKEN,
          {
            expiresIn: '1h',
          }
        );

        const refreshToken = sign(
          { sub: user.id },
          process.env.REFRESH_SECRET_TOKEN,
          {
            expiresIn: '1h',
          }
        );

        res.status(200).send({
          message: 'User successfully logged',
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user,
          },
        });
      }
    } catch (error: any) {
      res.status(error?.status || 500).send({ error: error?.message || error });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const allUsers = await this.userService.getAllUsers();
      res.status(200).send({ message: 'all users found', data: allUsers });
    } catch (error: any) {
      res.status(error?.status || 500).send({
        message: 'Something went wrong',
        data: error?.message || error,
      });
    }
  }

  async getOneUser(req: Request, res: Response): Promise<void> {
    const bearer = req.headers.authorization;
    console.log('\x1b[32mBearer : \x1b[0m', bearer);
    const token = bearer?.split(' ')[1];
    console.log('\x1b[32mtoken : \x1b[0m', token);

    if (!token) {
      res.status(404).send({ message: 'Missing Token' });
      return;
    } else {
      if (process.env.ACCESS_SECRET_TOKEN) {
        try {
          const payload: any = jwt.verify(
            token,
            process.env.ACCESS_SECRET_TOKEN
          );
          console.log('Payload : ', payload);
          const payloadExp: any = new Date(payload.exp * 1000);
          console.log(
            `Payload expires : ${payloadExp.getHours()}h${payloadExp.getMinutes()}`
          );

          if (!payload) {
            res.status(403).send({ message: 'Invalid Token' });
            return;
          }

          const user = await this.userService.getOneUser(payload);

          if (!user) {
            res.status(404).send({ message: "User doesn't exist" });
            return;
          }

          res.status(200).send({ message: 'Token valid', data: user });
        } catch (error: any) {
          console.log(`\x1b[31mToken Error : \x1b[0m${error.message}`);
          res.status(error?.status || 500).send({
            message: 'You need to reconnect',
            data: error?.message || error,
          });
        }
      }
    }
  }

  async deleteOneUser(req: Request, res: Response): Promise<void> {
    const paramId = req.params.id;
    try {
      const userToRemove = await this.userService.deleteOneUser(paramId);

      if (!userToRemove) {
        res.status(404).send({ message: 'User not found' });
      }
      res
        .status(200)
        .send({ message: 'User successfully removed', data: userToRemove });
    } catch (error: any) {
      res.status(error?.status || 500).send({
        message: 'Something went wrong',
        data: error?.message || error,
      });
    }
  }
}
