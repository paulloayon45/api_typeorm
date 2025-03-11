import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../users/user.model";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createDatabaseIfNotExists() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "",
    });

    console.log("Checking if database exists...");
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`);
    await connection.end();

    console.log("Database is ready!");
}

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE,
    entities: [User],
    synchronize: true,
    logging: true,
});

async function initializeDatabase() {
    await createDatabaseIfNotExists(); // Ensure DB exists **before** TypeORM initializes.

    console.log("Initializing TypeORM Data Source...");
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");
    } catch (err) {
        console.error("Error initializing data source:", err);
    }
}

initializeDatabase();