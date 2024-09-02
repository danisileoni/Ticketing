import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";

import { curretUserRouter } from "./routes/current-user";
import { singinRouter } from "./routes/singin";
import { singoutRouter } from "./routes/singout";
import { singupRouter } from "./routes/singup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(curretUserRouter);
app.use(singinRouter);
app.use(singoutRouter);
app.use(singupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!");
  });
};

start();
