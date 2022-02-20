import { Schema, model } from "mongoose";

interface Team {
  name: string;
  logo: string;
}

const TeamSchema = new Schema<Team>(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Teams = model<Team>("Team", TeamSchema);

export = Teams;
