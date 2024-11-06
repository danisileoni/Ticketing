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
export class Ticket {
  @Prop({ unique: true, required: true })
  public title!: string;

  @Prop({ required: true, type: () => Number })
  public price!: number;

  @Prop({ required: true })
  public userId!: string;

  @Prop()
  public orderId?: string;
}

const TicketModel = getModelForClass(Ticket);

export default TicketModel;
