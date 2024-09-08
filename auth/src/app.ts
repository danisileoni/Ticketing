import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { curretUserRouter } from "./routes/current-user";
import { singinRouter } from "./routes/singin";
import { singoutRouter } from "./routes/singout";
import { singupRouter } from "./routes/singup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  }),
);

app.use(curretUserRouter);
app.use(singinRouter);
app.use(singoutRouter);
app.use(singupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
