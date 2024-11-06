import request from "supertest";
import { app } from "../../app";

const createTicket = ({ title, price }: { title: string; price: number }) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title, price });
};

it("can fetch a list of tickets", async () => {
  await createTicket({ title: "anto", price: 10 });
  await createTicket({ title: "abc", price: 20 });
  await createTicket({ title: "cuatrocincoseis", price: 30 });

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
