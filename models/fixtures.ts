import mongoose, { Schema, model } from "mongoose";
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

interface Fixture {
  homeTeam: string;
  awayTeam: string;
  time: string;
  date: string;
  stadium: string;
  referee: string;
  status: string;
  slug: string;
}

const FixtureSchema = new Schema<Fixture>(
  {
    homeTeam: {
      type: String,
      required: true,
    },
    awayTeam: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    stadium: {
      type: String,
      required: true,
    },
    referee: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
    slug: {
      type: String, 
      slug: ["homeTeam", "awayTeam", "date"], 
      unique: true
    }
  },
  { timestamps: true }
);

const Fixtures = model<Fixture>("Fixture", FixtureSchema);

export = Fixtures;
