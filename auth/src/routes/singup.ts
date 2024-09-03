import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

import User from "../models/user";
import { RequestValidationError } from "../errors/request-validation-error";
import { MongoServerError } from "mongodb";
import { BadRequestError } from "../errors/bad-request-error";

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
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
      }

      const { email, password } = req.body;

      const user = new User({
        email,
        password: await bcrypt.hash(password, 10),
      });

      await user.save();

      res.send(user);
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
