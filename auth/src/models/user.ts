import { getModelForClass, modelOptions, Prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
})
export class User {
  @Prop({ unique: true, required: true })
  public email!: string;

  @Prop({ required: true })
  public password!: string;
}

const UserModel = getModelForClass(User);
export default UserModel;
