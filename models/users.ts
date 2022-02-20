import { Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

interface Type {
  firstname: string;
  lastname: string;
  admin: boolean;
}

const User = new Schema<Type>(
  {
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//adds username and password
User.plugin(passportLocalMongoose);

const Users = model<Type>("User", User);

export = Users;
