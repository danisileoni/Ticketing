import express from "express";
import { json } from "body-parser";
import { curretUserRouter } from "./routes/current-user";
import { singinRouter } from "./routes/singin";
import { singoutRouter } from "./routes/singout";
import { singupRouter } from "./routes/singup";
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.use(json());

app.use(curretUserRouter);
app.use(singinRouter);
app.use(singoutRouter);
app.use(singupRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000!!");
});
