import { OrderStatus } from "@dasitickets/common";
import {
  getModelForClass,
  modelOptions,
  plugin,
  Prop,
} from "@typegoose/typegoose";
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

  @Prop({ required: true })
  public price!: number;

  @Prop({ required: true })
  public status!: OrderStatus;
}

const OrderModel = getModelForClass(Order);
export default OrderModel;
