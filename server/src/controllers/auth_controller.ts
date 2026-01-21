import type { Request, Response } from "express";
import { pool } from "../db/index.js";
// import bcrypt from 'bcrypt';

export async function register (req: Request, res: Response){
    console.log("👉 register Controller hit");
    
    const bcrypt = require('bcrypt');
    const {email, password} = req.body;

      console.log("👉 User:",email, password);

    const hasedPassword = await bcrypt.hash(password);
    console.log('>>>> hased password:', hasedPassword)

    await pool.query("INSERT INTO users (email, password) values ($1, $2)", [email, hasedPassword])

    res.status(201).json({message: "User Created"})
}

export async function login (req: Request, res: Response){
      console.log("👉 login Controller hit");
    const {email, password} = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    console.log('>>>>> user/result:', result)
    // const user = result.

}