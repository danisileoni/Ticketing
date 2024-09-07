import express, { Request, Response } from "express";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { MongoServerError } from "mongodb";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/singup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = new User({
        email,
        password: await bcrypt.hash(password, 10),
      });

      await user.save();

      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!,
      );

      req.session = {
        jwt: userJwt,
      };

      res.status(200).send(user);
    } catch (error) {
      if (error instanceof MongoServerError) {
        if (error.code === 11000) {
          throw new BadRequestError("The email must be unique");
        }
      }
    }
  },
);

export { router as singupRouter };
