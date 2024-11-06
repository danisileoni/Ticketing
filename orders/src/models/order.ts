import { OrderStatus } from "@dasitickets/common";
import {
  getModelForClass,
  modelOptions,
  plugin,
  Prop,
} from "@typegoose/typegoose";
import mongoose from "mongoose";
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
export class Order {
  @Prop({ required: true })
  public userId!: string;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.Created })
  public status!: OrderStatus;

  @Prop({ type: mongoose.Schema.Types.Date })
  public expiresAt!: Date;

  @Prop({ required: true, ref: "Ticket", type: mongoose.Schema.Types.ObjectId })
  public ticket!: mongoose.Types.ObjectId;
}

const OrderModel = getModelForClass(Order);
export default OrderModel;
