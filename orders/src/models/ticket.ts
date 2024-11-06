import {
  getModelForClass,
  modelOptions,
  plugin,
  Prop,
} from "@typegoose/typegoose";
import OrderModel from "./order";
import { OrderStatus } from "@dasitickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  },
})
@plugin(updateIfCurrentPlugin)
export class Ticket {
  @Prop({ required: true })
  public title!: string;

  @Prop({ required: true, min: 0 })
  public price!: number;

  public async isReserved(): Promise<boolean> {
    const existingOrder = await OrderModel.findOne({
      ticket: this,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });

    return !!existingOrder;
  }
}

const TicketModel = getModelForClass(Ticket);
export default TicketModel;
