import { Sequelize } from "sequelize";
import { dbConfig } from "./config";
import Adventure from "./models/adventure";
import User from "./models/user";

const db = new Sequelize(dbConfig)

export const Adventures = Adventure(db);
export const Users = User(db);