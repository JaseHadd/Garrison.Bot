import * as dotenv from 'dotenv'
import { Dialect, Options } from 'sequelize';

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;
let {
    DATABASE_DIALECT,
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_STORAGE,
    GARRISON_URL } = process.env;

const isDialect = function(str: string | undefined): str is Dialect
{
    return !!str && ['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql', 'db2', 'snowflake', 'oracle']
        .includes(str);
}

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID)
    throw new Error('Missing variables in .env');

if (!isDialect(DATABASE_DIALECT))
    throw new Error(`Invalid dialect: ${DATABASE_DIALECT}`);
else if (DATABASE_DIALECT === 'sqlite')
    DATABASE_STORAGE ??= 'database.sqlite';
else
    DATABASE_STORAGE = undefined;

if (!GARRISON_URL)
    throw new Error('Garrison URL must be provided');

export const botConfig = {
    token: DISCORD_TOKEN,
    clientId: DISCORD_CLIENT_ID
}

export const apiConfig = {
    baseUrl: GARRISON_URL
}

export const dbConfig: Options = {
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT,
    storage: DATABASE_STORAGE,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    logging: console.log,
    define: {
        underscored: true
    }
};