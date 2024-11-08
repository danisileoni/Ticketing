import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdasd";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db?.collections();

  if (!collections) {
    return;
  }

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// key disable
process.env.STRIPE_KEY =
  "sk_test_51QF1NNJ3iMjbLnvxkjrkgrx7ubmM7u62hS85qK24TZxaYUIV2IJnIZbMGvklKSRw3iiVEECKkuoLplmIETodbubG00lGYbLwP4";

afterAll(async () => {
  if (mongo) {
    await mongo.stop;
  }

  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // build a jwt payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object. {jwt: my_jwt}
  const session = { jwt: token };

  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encode data
  return [`session=${base64}`];
};
