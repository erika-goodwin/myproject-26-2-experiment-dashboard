import type { Request, Response } from "express";
import { pool } from "../db/index.js";

export async function getExperiments (req: Request, res: Response){
    const result = await pool.query("SELECT * FROM experiments");

    // res.send("Hello, TypeScript + Express!");
    res.json(result.rows);
}