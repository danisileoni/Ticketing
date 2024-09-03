import { getModelForClass, Prop } from "@typegoose/typegoose";

export class User {
  @Prop({ unique: true })
  public email!: string;

  @Prop()
  public password!: string;
}

const UserModel = getModelForClass(User);
export default UserModel;
