import { Sequelize } from "sequelize";
import { dbConfig } from "./config";

const db = new Sequelize(dbConfig);

(await import('./models/adventure')).default(db);
(await import('./models/user')).default(db);

db.sync({ force: process.argv.includes('--force') || process.argv.includes('-f') }).then(async () => {
    db.close();
}).catch(console.error);