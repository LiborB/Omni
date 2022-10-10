import {DataSource} from "typeorm";
import "dotenv/config"

export const connectionSource = new DataSource({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    type: "postgres",
    port: 5432,
    database: "omni",
    entities: ["src/**/*.entity.{ts,js}"],
    migrations: ["src/migrations/**/*.{ts,js}"],
    synchronize: false
});