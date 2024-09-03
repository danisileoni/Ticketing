import { getModelForClass, Prop } from "@typegoose/typegoose";

export class User {
  @Prop({ unique: true })
  public email!: string;

  @Prop({ minlength: 4, maxlength: 24 })
  public password!: string;
}

const UserModel = getModelForClass(User);
export default UserModel;
