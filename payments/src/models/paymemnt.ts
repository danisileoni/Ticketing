import { getModelForClass, modelOptions, Prop } from "@typegoose/typegoose";

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
export class Payment {
  @Prop({ required: true })
  public orderId!: string;

  @Prop({ required: true })
  public stripeId!: string;
}

const PaymentModel = getModelForClass(Payment);
export default PaymentModel;
